import { startOfDay, endOfDay, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Appointment from '../models/Appointment';
import User from '../models/User';

class ScheduleController {
  async index(req, res) {
    const checkUserProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!checkUserProvider) {
      return res.status(401).json({ error: 'User is not a provider' });
    }

    const { date = new Date() } = req.query;
    const parseDate = parseISO(date);

    const appointments = await Appointment.findAll({
      where: {
        provider_id: req.userId,
        canceled_at: null,
        date: {
          [Op.between]: [startOfDay(parseDate), endOfDay(parseDate)],
        },
      },
      order: ['date'],
    });

    return res.json({ appointments });
  }
}

export default new ScheduleController();

/**
 * @swagger
 * tags:
 *   name: Schedule
 *   description: Schedule
 */

/**
 * @swagger
 * path:
 *  /schedule:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: List schedule
 *      tags: [Schedule]
 *      parameters:
 *        - name: date
 *          in: query
 *          schema:
 *            type: string
 *            format: date-time
 *            default: 2020-01-09T15:00:00-03:00
 *          description: Day for query
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */
