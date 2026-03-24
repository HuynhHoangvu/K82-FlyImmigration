import { Repository } from 'typeorm';
import { Job } from './job.entity';
import { CreateJobDto, UpdateJobDto, QueryJobDto } from './dto/job.dto';
import { Storage } from '@google-cloud/storage';
export declare class JobsService {
    private jobsRepo;
    private storage;
    constructor(jobsRepo: Repository<Job>, storage: Storage);
    findAll(query: QueryJobDto): Promise<{
        data: Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findHot(): Promise<Job[]>;
    findAllAdmin(query: QueryJobDto): Promise<{
        data: Job[];
        meta: {
            total: number;
            page: number;
            limit: number;
            totalPages: number;
        };
    }>;
    findOne(id: string): Promise<Job>;
    create(dto: CreateJobDto, file?: Express.Multer.File): Promise<Job>;
    update(id: string, dto: UpdateJobDto, file?: Express.Multer.File): Promise<Job>;
    remove(id: string): Promise<{
        message: string;
    }>;
    getStats(): Promise<{
        totalJobs: number;
        activeJobs: number;
        totalUsers: number;
        totalViews: number;
        byCountry: any[];
    }>;
    private findOneRaw;
    private saveFile;
}
