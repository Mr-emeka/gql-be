import mongoose  from "mongoose";
import hobbies from "./models/hobbies";
import student from "./models/student";

type ModelName =
  | "hobbies"
  | "student";

type ModelType = {
  hobbies: typeof mongoose.Model;
  student: typeof mongoose.Model;
};

class Repository {
  private models: ModelType;

  constructor() {
    this.models = {
      hobbies,
      student,
    } as ModelType;
  }

  async createRecord<T>(
    modelName: ModelName,
    data: Partial<T>,
    options?: {
      session?: mongoose.ClientSession;
    }
  ): Promise<T> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    if (options?.session) {
      return (await Model.create(data, { session: options.session })) as T;
    }

    const record = new Model(data);

    return (await record.save()) as T;
  }

  async findRecordBy<T>(
    modelName: ModelName,
    options: {
      query: Partial<T> | any;
      populateFields?: any | string;
      lean?: boolean;
      select?: string;
      options?: any;
      session?: any;
    }
  ): Promise<T | null> {
    const Model = this.models[modelName];
    let queryBuilder = Model.findOne(options.query);

    if (options.populateFields) {
      queryBuilder = queryBuilder.populate(options.populateFields);
    }

    if (options.select) {
      queryBuilder = queryBuilder.select(options.select);
    }

    if (options.lean) {
      queryBuilder = queryBuilder.lean();
    }

    if (options.options) {
      queryBuilder = queryBuilder.setOptions(options.options);
    }

    if (options.session) {
      queryBuilder = queryBuilder.session(options.session);
    }

    const record = await queryBuilder.exec();
    return record ? (record as T) : null;
  }

  async insertManyRecords<T>(
    modelName: ModelName,
    data: Partial<T>[]
  ): Promise<T[] | null> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    try {
      const records = await Model.insertMany(data, {
        ordered: false,
        rawResult: false,
      });
      return records as any;
    } catch (error) {
      console.error("Error occurred while inserting records:", error);
      return null;
    }
  }

  async findAndUpdateRecordBy<T>(
    modelName: ModelName,
    options: {
      filter: Partial<T>;
      payload: Partial<any>;
      populateFields?: any;
      session?: any;
    }
  ): Promise<T | null> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    let queryBuilder = Model.findOneAndUpdate(options.filter, options.payload, {
      new: true,
    });

    if (options.session) {
      queryBuilder = queryBuilder.session(options.session);
    }

    if (options.populateFields) {
      queryBuilder = queryBuilder.populate(options.populateFields);
    }

    const record = await queryBuilder;

    return record;
  }

  async findAndUpdateManyRecordsBy<T>(
    modelName: ModelName,
    options: {
      query: Partial<T>;
      payload: any;
      populateFields?: any;
      session?: any;
    }
  ) {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    let queryBuilder = Model.updateMany(options.query, options.payload, {
      new: true,
    });

    if (options.session) {
      queryBuilder = queryBuilder.session(options.session);
    }

    if (options.populateFields) {
      queryBuilder = queryBuilder.populate(options.populateFields);
    }

    const record = await queryBuilder;

    return record;
  }

  async findRecordsBy<T>(
    modelName: ModelName,
    options: {
      query?: Partial<T> | any;
      populateFields?: any;
      limit?: number;
      lean?: boolean;
      sort?: any;
      select?: string;
      options?: any;
      session?: any;
    }
  ): Promise<T[]> {
    const Model = this.models[modelName];
    let queryBuilder = Model.find(options.query || {});

    if (options.populateFields) {
      queryBuilder = queryBuilder.populate(options.populateFields);
    }

    if (options.select) {
      queryBuilder = queryBuilder.select(options.select);
    }

    if (options.limit) queryBuilder = queryBuilder.limit(options.limit);

    if (options.lean) queryBuilder = queryBuilder.lean();

    if (options.sort) queryBuilder = queryBuilder.sort(options.sort);

    if (options.options) {
      queryBuilder = queryBuilder.setOptions(options.options);
    }

    if (options.session) {
      queryBuilder = queryBuilder.session(options.session);
    }

    const records = await queryBuilder.exec();
    return records.map((record) => record as T);
  }

  async aggregate<T>(
    modelName: ModelName,
    pipeline: any[],
    options?: any
  ): Promise<any[]> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    let query = Model.aggregate(pipeline).allowDiskUse(true);

    if (options?.allowDiskUse) {
      query = query.allowDiskUse(options.allowDiskUse);
    }

    const result = await query.exec();
    return result as T[];
  }

  async countRecordsBy<T>(
    modelName: ModelName,
    query: Partial<T> | any
  ): Promise<number> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    return await Model.countDocuments(query);
  }

  async distinctRecordsBy<T>(
    modelName: ModelName,
    query: Partial<T> | any,
    field: string
  ): Promise<string[]> {
    const Model = this.models[modelName];
    return await Model.distinct(field, query);
  }

  async deleteRecordBy<T>(
    modelName: ModelName,
    options: {
      query?: Partial<T>;
      populateFields?: any;
    }
  ): Promise<boolean> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    const result = await Model.deleteOne(options.query || {});
    return result.deletedCount === 1;
  }

  async deleteRecordsBy<T>(
    modelName: ModelName,
    options?: {
      query: Partial<T>;
    }
  ): Promise<boolean> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    const result = await Model.deleteMany(options?.query || {});
    return result.deletedCount === 1;
  }

  async findPaginatedRecordsBy<T>(
    modelName: ModelName,
    options: {
      query?: Partial<T> | any;
      page: number;
      limit?: number;
      sort?: string | any;
      populateFields?: any;
      options?: any;
    }
  ): Promise<{ records: T[]; nextPage?: number }> {
    const Model = this.models[modelName];
    if (!Model) {
      throw new Error(`Model '${modelName}' not found`);
    }

    const totalRecords = await this.countRecordsBy(modelName, options.query);
    const totalPages = Math.ceil(totalRecords / (options.limit || 10));

    const skip = ((options.page || 1) - 1) * (options.limit || 10);

    let queryBuilder = Model.find(options.query || {});

    if (options.populateFields)
      queryBuilder = queryBuilder.populate(options.populateFields);

    if (options.sort) queryBuilder = queryBuilder.sort(options.sort);

    queryBuilder = queryBuilder.limit(options.limit || 10);

    if (options.options) {
      queryBuilder = queryBuilder.setOptions(options.options);
    }

    queryBuilder = queryBuilder.lean();

    queryBuilder = queryBuilder.skip(skip);

    const records = await queryBuilder;

    let nextPage: number | undefined = undefined;

    if ((options.page || 1) < totalPages) {
      nextPage = (options.page || 1) + 1;
    }

    return { records, nextPage };
  }

  async useTransaction(
    callback: (session: mongoose.ClientSession) => Promise<void>
  ): Promise<void> {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      await callback(session);
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
}

export default new Repository();