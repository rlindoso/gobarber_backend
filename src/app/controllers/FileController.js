import File from '../models/File';

class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file;

    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();

/**
 * @swagger
 * tags:
 *   name: File
 *   description: File
 */

/**
 * @swagger
 * path:
 *  /file:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      summary: Create file
 *      tags: [File]
 *      parameters:
 *        - name: file
 *          in: query
 *          schema:
 *            type: file
 *          description: File image for avatar
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
