import { Test, type TestingModule } from '@nestjs/testing'
import { DatabaseService } from './database.service'
import {
  ColumnType,
  type Generated,
  type Insertable,
  JSONColumnType,
  type Selectable,
  type Updateable,
} from 'kysely'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { join } from 'node:path'

interface UserTable {
  id: Generated<number>
  name: string
}

interface Database {
  fake_users: UserTable
}

type insertUser = Insertable<UserTable>
type selectUser = Selectable<UserTable>

describe('DatabaseService', () => {
  let service: DatabaseService

  beforeAll(async () => { 
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: [ join(__dirname, '../../../', '.env.local') ]
        })
      ],
      providers: [DatabaseService],
    }).compile()

    service = module.get<DatabaseService>(DatabaseService)
    const db = service.getDatabase<Database>()
    await db.schema.dropTable("fake_users").ifExists().execute()
    await db.schema.createTable("fake_users")
                    .addColumn("name", "varchar(128)", col => col.notNull())
                    .addColumn("id", "serial", col => col.primaryKey())
                    .execute()
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })
  
  it('should execute a query', async () => {

      const db = service.getDatabase<Database>()
      expect(db).not.toBeNull()
      
      await db.insertInto("fake_users").values({
        name: "John Doe"
      }).execute()

      const { name } = await db.selectFrom("fake_users").select("name").where("id","=", 1).executeTakeFirst()  

      expect(name).toBe("John Doe")
  }, 100000)


  afterAll(async () => {
    await service.getDatabase<Database>().schema.dropTable("fake_users").execute()
  })

})
