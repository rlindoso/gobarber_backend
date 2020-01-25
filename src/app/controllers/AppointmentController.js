import * as Yup from 'yup';
import { startOfHour, parseISO, isBefore, format, subHours } from 'date-fns';
import pt from 'date-fns/locale/pt';
import User from '../models/User';
import File from '../models/File';
import Appointment from '../models/Appointment';
import Notification from '../schemas/Notification';

import Queue from '../../lib/Queue';
import CancellationMail from '../jobs/CancellationMail';

class AppointmentController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const appointments = await Appointment.findAll({
      where: { user_id: req.userId, canceled_at: null },
      order: ['date'],
      attributes: ['id', 'date'],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['id', 'name'],
          include: [
            {
              model: File,
              as: 'avatar',
              attributes: ['name', 'path', 'url'],
            },
          ],
        },
      ],
    });

    return res.json(appointments);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      provider_id: Yup.number().required(),
      date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validations fails' });
    }

    const { provider_id, date } = req.body;

    /**
     * Check if provider_id is a provider
     */
    const isProvider = await User.findOne({
      where: { id: provider_id, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'You can only create appointments with prividers' });
    }

    const hourStart = startOfHour(parseISO(date));

    /**
     * check for past dates
     */
    if (isBefore(hourStart, new Date())) {
      return res.status(400).json({ error: 'Past dates are not permited' });
    }

    /**
     * check date availability
     */
    const checkAvailability = await Appointment.findOne({
      where: {
        provider_id,
        canceled_at: null,
        date: hourStart,
      },
    });

    if (checkAvailability) {
      return res
        .status(400)
        .json({ error: 'Appointment date is not available' });
    }

    const appointment = await Appointment.create({
      user_id: req.userId,
      provider_id,
      date: hourStart,
    });

    /**
     * Notify appointment provider
     */
    const user = await User.findByPk(req.userId);
    const formattedDate = format(
      hourStart,
      "'dia 'dd' de 'MMMM', às 'H:mm'h'",
      { locale: pt }
    );

    await Notification.create({
      content: `Novo agendamento de ${user.name} para o ${formattedDate}`,
      user: provider_id,
    });

    return res.json(appointment);
  }

  async delete(req, res) {
    const appointment = await Appointment.findByPk(req.params.id, {
      include: [
        {
          model: User,
          as: 'provider',
          attributes: ['name', 'email'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['name'],
        },
      ],
    });

    if (appointment.user_id !== req.userId) {
      return res.status(401).json({
        error: "You don't have permission to cancel this appontment.",
      });
    }

    const dateWithSub = subHours(appointment.date, 2);

    if (isBefore(dateWithSub, new Date())) {
      return res.status(401).json({
        error: 'You can only cancel appointments 2 hours in advance.',
      });
    }

    appointment.canceled_at = new Date();

    await appointment.save();

    await Queue.add(CancellationMail.key, {
      appointment,
    })
    
    return res.json(appointment);
  }
}

export default new AppointmentController();

/**
 * @swagger
 * tags:
 *   name: Appointment
 *   description: Appointment
 */

/**
 * @swagger
 * path:
 *  /appointments:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: List appointments
 *      tags: [Appointment]
 *      responses:
 *        "200":
 *          description: A appointment schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */

/**
 * @swagger
 * path:
 *  /appointments:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      summary: Create appointment
 *      tags: [Appointment]
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              required:
 *                - provider_id
 *                - date
 *              properties:
 *                provider_id:
 *                  type: integer
 *                  description: Id of a provider.
 *                date:
 *                  type: string
 *                  format: date-time
 *                  default: 2020-01-09T15:00:00-03:00
 *                  description: Date of appointment
 *              example:
 *                provider_id: 1
 *                date: 2020-01-09T15:00:00-03:00
 *      responses:
 *        "200":
 *          description: A appointment schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */

/**
 * @swagger
 * path:
 *  /appointments/{id}:
 *    delete:
 *      security:
 *        - bearerAuth: []
 *      summary: Delete appointments
 *      tags: [Appointment]
 *      parameters:
 *        - name: id
 *          in: path
 *          schema:
 *            type: integer
 *            format: integer,
 *            default: 1
 *          description: Id appointment
 *      responses:
 *        "200":
 *          description: A appointment schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */
