import { z } from 'zod'
import { Context } from 'hono'
import { files } from '../../data/schemas'
import { Endpoint } from '../endpoint'
import { HTTPException } from 'hono/http-exception'
import { eq } from 'drizzle-orm'
import { contentJson } from 'chanfana'
import { MAX_DURATION } from '../common'

const updateFileSchema = z.object({
  due_date: z.number().optional().nullable(), // timestamp or null for permanent
})

export class UpdateFile extends Endpoint {
  schema = {
    request: {
      params: z.object({
        id: z.string(),
      }),
      body: contentJson(updateFileSchema),
    },
    responses: {
      '200': {
        description: 'File updated successfully',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
      '404': {
        description: 'File not found',
        content: {
          'application/json': {
            schema: z.object({
              success: z.boolean(),
              message: z.string(),
            }),
          },
        },
      },
    },
  }

  async handle(c: Context) {
    const { params, body } = await this.getValidatedData<typeof this.schema>()
    const { id } = params
    const { due_date } = body

    const db = this.getDB(c)

    // Check if file exists
    const existingFile = await db
      .select()
      .from(files)
      .where(eq(files.id, id))
      .get()

    if (!existingFile) {
      throw new HTTPException(404, { message: 'File not found' })
    }

    // Update the file
    const actualDueDate =
      due_date === null
        ? MAX_DURATION.toDate()
        : due_date
          ? new Date(due_date)
          : undefined

    await db
      .update(files)
      .set({
        due_date: actualDueDate,
      })
      .where(eq(files.id, id))

    return c.json({
      success: true,
      message: 'File updated successfully',
    })
  }
}
