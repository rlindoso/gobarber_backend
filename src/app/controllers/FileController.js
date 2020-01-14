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
 *  /files:
 *    post:
 *      security:
 *        - bearerAuth: []
 *      summary: Create file
 *      tags: [File]
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              required:
 *                - file
 *              properties:
 *                file:
 *                  type: file
 *                  description: File for user's avatar.
 *      responses:
 *        "200":
 *          description: A user schema
 *          content:
 *            application/json:
 *              schema:
 *                noExemple: noExemple
 */
