import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { StudyApplication, StudyApplicationStatus } from './study-application.entity'
import * as fs from 'fs'
import * as path from 'path'

// Sample data for seeding study applications
const SAMPLE_STUDY_APPLICATIONS = [
  {
    fullName: 'Nguyễn Văn An',
    email: 'nguyenvanan@gmail.com',
    phone: '0901234567',
    dateOfBirth: '1998-05-15',
    address: 'Quận 1, TP. Hồ Chí Minh',
    education: 'Đại học Kinh tế TP.HCM - Cử nhân Kinh tế',
    experience: '2 năm kinh nghiệm làm nhân viên kinh doanh tại công ty xuất nhập khẩu',
    languageLevel: 'IELTS 6.5',
    targetCountry: 'australia',
    major: 'Master of Business Administration',
    degreeLevel: 'master',
    intake: 'February 2025',
    budget: '50,000 - 60,000 AUD',
    status: StudyApplicationStatus.PENDING,
  },
  {
    fullName: 'Trần Thị Bình',
    email: 'tranthibinh@gmail.com',
    phone: '0912345678',
    dateOfBirth: '2000-08-20',
    address: 'Quận Cầu Giấy, Hà Nội',
    education: 'THPT Chuyên Ngoại ngữ - IELTS 7.0',
    experience: 'Hoạt động tình nguyện, CLB Tiếng Anh trường',
    languageLevel: 'IELTS 7.0',
    targetCountry: 'australia',
    major: 'Bachelor of Computer Science',
    degreeLevel: 'bachelor',
    intake: 'July 2025',
    budget: '45,000 - 55,000 AUD/năm',
    status: StudyApplicationStatus.REVIEWING,
  },
  {
    fullName: 'Lê Minh Châu',
    email: 'leminhchau@gmail.com',
    phone: '0923456789',
    dateOfBirth: '1995-12-10',
    address: 'Quận Hải Châu, Đà Nẵng',
    education: 'Đại học Đà Nẵng - Kỹ sư Công nghệ thông tin',
    experience: '3 năm làm lập trình viên tại FPT Software',
    languageLevel: 'IELTS 6.0',
    targetCountry: 'australia',
    major: 'Master of Information Technology',
    degreeLevel: 'master',
    intake: 'February 2025',
    budget: '55,000 - 65,000 AUD',
    status: StudyApplicationStatus.APPROVED,
  },
  {
    fullName: 'Phạm Hoàng Dũng',
    email: 'phamhoangdung@gmail.com',
    phone: '0934567890',
    dateOfBirth: '2001-03-25',
    address: 'Quận Ninh Kiều, Cần Thơ',
    education: 'THPT Lý Tự Trọng - GPA 8.5/10',
    experience: 'Thành viên đội tuyển học sinh giỏi Toán',
    languageLevel: 'IELTS 6.0 (dự kiến thi lại)',
    targetCountry: 'australia',
    major: 'Bachelor of Engineering (Civil)',
    degreeLevel: 'bachelor',
    intake: 'February 2026',
    budget: '40,000 - 50,000 AUD/năm',
    status: StudyApplicationStatus.PENDING,
  },
  {
    fullName: 'Võ Thị Hương',
    email: 'vothihuong@gmail.com',
    phone: '0945678901',
    dateOfBirth: '1997-07-08',
    address: 'Quận Long Biên, Hà Nội',
    education: 'Học viện Ngân hàng - Cử nhân Tài chính',
    experience: '2 năm làm chuyên viên tín dụng tại Vietcombank',
    languageLevel: 'IELTS 6.5',
    targetCountry: 'australia',
    major: 'Master of Finance',
    degreeLevel: 'master',
    intake: 'July 2025',
    budget: '50,000 - 60,000 AUD',
    status: StudyApplicationStatus.REVIEWING,
  },
  {
    fullName: 'Đặng Quang Huy',
    email: 'dangquanghuy@gmail.com',
    phone: '0956789012',
    dateOfBirth: '1999-11-30',
    address: 'Quận 7, TP. Hồ Chí Minh',
    education: 'Đại học Y Dược TP.HCM - Dược sĩ',
    experience: '1 năm làm dược sĩ tại nhà thuốc',
    languageLevel: 'IELTS 7.0',
    targetCountry: 'australia',
    major: 'Master of Pharmacy',
    degreeLevel: 'master',
    intake: 'February 2025',
    budget: '60,000 - 70,000 AUD',
    status: StudyApplicationStatus.APPROVED,
  },
  {
    fullName: 'Hoàng Thị Mai',
    email: 'hoangthimai@gmail.com',
    phone: '0967890123',
    dateOfBirth: '2002-01-18',
    address: 'Thành phố Vinh, Nghệ An',
    education: 'THPT Phan Bội Châu - GPA 9.0/10',
    experience: 'Học sinh xuất sắc, giải Nhì Olympic Toán cấp tỉnh',
    languageLevel: 'IELTS 7.5',
    targetCountry: 'australia',
    major: 'Bachelor of Science (Mathematics)',
    degreeLevel: 'bachelor',
    intake: 'July 2025',
    budget: '45,000 - 55,000 AUD/năm',
    status: StudyApplicationStatus.PENDING,
  },
  {
    fullName: 'Ngô Văn Khoa',
    email: 'ngovankhoa@gmail.com',
    phone: '0978901234',
    dateOfBirth: '1996-04-22',
    address: 'Quận Thanh Khê, Đà Nẵng',
    education: 'Đại học Kiến trúc Đà Nẵng - Kiến trúc sư',
    experience: '3 năm làm kiến trúc sư tại công ty thiết kế',
    languageLevel: 'IELTS 6.0',
    targetCountry: 'australia',
    major: 'Master of Architecture',
    degreeLevel: 'master',
    intake: 'February 2025',
    budget: '55,000 - 65,000 AUD',
    status: StudyApplicationStatus.REJECTED,
    adminNote: 'Chưa đủ điều kiện ngôn ngữ. Khuyến nghị học thêm tiếng Anh.',
  },
  {
    fullName: 'Lý Thùy Linh',
    email: 'lythuylinh@gmail.com',
    phone: '0989012345',
    dateOfBirth: '1998-09-05',
    address: 'Quận Bình Thạnh, TP. Hồ Chí Minh',
    education: 'Đại học Ngoại thương - Cử nhân Marketing',
    experience: '2 năm làm marketing executive tại agency',
    languageLevel: 'IELTS 6.5',
    targetCountry: 'australia',
    major: 'Master of Marketing',
    degreeLevel: 'master',
    intake: 'July 2025',
    budget: '45,000 - 55,000 AUD',
    status: StudyApplicationStatus.PENDING,
  },
  {
    fullName: 'Trịnh Văn Nam',
    email: 'trinhvannam@gmail.com',
    phone: '0990123456',
    dateOfBirth: '2000-06-14',
    address: 'Quận Hà Đông, Hà Nội',
    education: 'Đại học Bách khoa Hà Nội - Kỹ sư Điện',
    experience: 'Thực tập sinh tại Samsung Electronics',
    languageLevel: 'IELTS 6.0',
    targetCountry: 'australia',
    major: 'Master of Electrical Engineering',
    degreeLevel: 'master',
    intake: 'February 2025',
    budget: '50,000 - 60,000 AUD',
    status: StudyApplicationStatus.WITHDRAWN,
  },
]

@Injectable()
export class StudyApplicationsSeed implements OnModuleInit {
  private readonly logger = new Logger(StudyApplicationsSeed.name)

  constructor(
    @InjectRepository(StudyApplication)
    private readonly appsRepo: Repository<StudyApplication>,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding study applications...')
    await this.seedStudyApplications()
  }

  private async seedStudyApplications() {
    try {
      // Load universities from JSON
      const seedPath = path.join(__dirname, '..', '..', '..', 'australian_universities_seed.json')
      let universities: string[] = []

      if (fs.existsSync(seedPath)) {
        const rawData = fs.readFileSync(seedPath, 'utf-8')
        const data = JSON.parse(rawData)
        universities = data.map((u: any) => u.name)
        this.logger.log(`Loaded ${universities.length} universities from JSON`)
      }

      // Create or update study applications
      let created = 0
      let updated = 0

      for (const appData of SAMPLE_STUDY_APPLICATIONS) {
        const randomUniversity = universities.length > 0
          ? universities[Math.floor(Math.random() * universities.length)]
          : 'University of Melbourne'

        // Check if exists by email
        const existing = await this.appsRepo.findOne({ where: { email: appData.email } })

        if (existing) {
          // Update existing
          await this.appsRepo.update(existing.id, {
            ...appData,
            university: randomUniversity,
          })
          updated++
        } else {
          // Create new
          const app = this.appsRepo.create({
            ...appData,
            university: randomUniversity,
          })
          await this.appsRepo.save(app)
          created++
        }
      }

      this.logger.log(`Seeded study applications: ${created} created, ${updated} updated`)
    } catch (error) {
      this.logger.error('Failed to seed study applications', error)
    }
  }
}
