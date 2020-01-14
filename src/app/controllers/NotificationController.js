import User from '../models/User';
import Notification from '../schemas/Notification';

class NotificationController {
  async index(req, res) {
    const isProvider = await User.findOne({
      where: { id: req.userId, provider: true },
    });

    if (!isProvider) {
      return res
        .status(401)
        .json({ error: 'Only prividers con load notificatios' });
    }

    const notification = await Notification.find({
      user: req.userId,
    })
      .sort({ createdAt: `desc` })
      .limit(20);

    return res.json(notification);
  }

  async update(req, res) {
    const notification = await Notification.findByIdAndUpdate(
      req.params.id,
      { read: true },
      { new: true }
    );

    return res.json(notification)
  }
}

export default new NotificationController();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notifications
 */

/**
 * @swagger
 * path:
 *  /notifications:
 *    get:
 *      security:
 *        - bearerAuth: []
 *      summary: List Notifications
 *      tags: [Notifications]
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */

 /**
 * @swagger
 * path:
 *  /notifications/{id}:
 *    put:
 *      security:
 *        - bearerAuth: []
 *      summary: List Notifications
 *      tags: [Notifications]
 *      parameters:
 *        - name: id
 *          in: path
 *          schema:
 *            type: integer
 *            format: integer,
 *            default: 1
 *          description: Id notification
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */
