import { Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { News } from './news.entity'
import * as fs from 'fs'
import * as path from 'path'

// Sample study programs for seeding
const SAMPLE_STUDY_PROGRAMS = [
  {
    title: 'University of Melbourne - Master of Business Administration',
    slug: 'university-of-melbourne-mba',
    excerpt: 'Chương trình MBA hàng đầu Úc với học bổng lên đến 50% học phí. Thời gian học 2 năm, cơ hội việc làm sau tốt nghiệp.',
    content: `
## Giới thiệu chương trình

University of Melbourne là trường đại học hàng đầu Úc và top 20 thế giới. Chương trình MBA được thiết kế cho các nhà lãnh đạo tương lai.

## Ưu điểm
- Học bổng lên đến 50% học phí
- Cơ hội thực tập tại các doanh nghiệp lớn
- Mạng lưới cựu sinh viên toàn cầu
- Visa làm việc sau tốt nghiệp 2-4 năm

## Yêu cầu đầu vào
- IELTS 6.5+ hoặc tương đương
- GPA 7.0/10 trở lên
- 2 năm kinh nghiệm làm việc
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 45000,
    priceTo: 55000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
  {
    title: 'University of Sydney - Bachelor of Computer Science',
    slug: 'university-of-sydney-bcs',
    excerpt: 'Chương trình Cử nhân Khoa học Máy tính tại đại học danh giá nhất Sydney. Cơ hội học bổng quốc tế $10,000 - $20,000 AUD/năm.',
    content: `
## Giới thiệu chương trình

University of Sydney là trường đại học lâu đời nhất Úc với chất lượng giáo dục hàng đầu thế giới.

## Chuyên ngành
- Artificial Intelligence
- Cybersecurity
- Data Science
- Software Development

## Học bổng
- Sydney Scholars Award: $10,000 - $20,000 AUD/năm
- International Student Scholarship: lên đến $40,000 AUD
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 48000,
    priceTo: 52000,
    priceCurrency: 'AUD',
    itinerary: 'February, August',
    isPublished: true,
  },
  {
    title: 'Monash University - Master of Data Science',
    slug: 'monash-university-mds',
    excerpt: 'Chương trình Thạc sĩ Khoa học Dữ liệu tại Monash - top 1% thế giới về nghiên cứu. Học bổng $10,000 - $20,000 AUD.',
    content: `
## Giới thiệu chương trình

Monash University là thành viên Group of Eight - nhóm 8 trường đại học hàng đầu Úc.

## Nội dung chương trình
- Machine Learning & AI
- Big Data Analytics
- Statistical Modelling
- Data Visualisation

## Cơ hội nghề nghiệp
- Data Scientist
- Machine Learning Engineer
- Business Analyst
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 42000,
    priceTo: 48000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
  {
    title: 'RMIT University - Bachelor of Design',
    slug: 'rmit-university-design',
    excerpt: 'Chương trình Cử nhân Thiết kế tại RMIT - top 20 thế giới về nghệ thuật và thiết kế. Cơ hội thực tập và việc làm tại Melbourne.',
    content: `
## Giới thiệu chương trình

RMIT là trường đại học công nghệ hàng đầu Úc với thế mạnh về thiết kế và nghệ thuật.

## Chuyên ngành
- Graphic Design
- Industrial Design
- Digital Media
- Fashion Design

## Đặc điểm
- Thực tập tại doanh nghiệp
- Studio-based learning
- Kết nối ngành công nghiệp
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 35000,
    priceTo: 42000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
  {
    title: 'TAFE NSW - Certificate IV in Commercial Cookery',
    slug: 'tafe-nsw-commercial-cookery',
    excerpt: 'Chương trình Du học nghề Bếp trưởng tại TAFE NSW. Chi phí thấp, cơ hội định cư cao với nghề tay nghề cao.',
    content: `
## Giới thiệu chương trình

TAFE NSW là hệ thống giáo dục nghề nghiệp lớn nhất Úc với chi phí hợp lý và cơ hội việc làm cao.

## Ưu điểm
- Chi phí học tập thấp
- Thực hành nhiều
- Cơ hội việc làm cao
- Định cư theo nghề tay nghề

## Yêu cầu
- IELTS 5.5+
- Tốt nghiệp THPT
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'vocational',
    priceFrom: 12000,
    priceTo: 18000,
    priceCurrency: 'AUD',
    itinerary: 'February, July, October',
    isPublished: true,
  },
  {
    title: 'University of Queensland - Bachelor of Engineering',
    slug: 'university-of-queensland-engineering',
    excerpt: 'Chương trình Kỹ sư tại UQ - top 50 thế giới về Kỹ thuật. Học bổng quốc tế lên đến $10,000 AUD/năm.',
    content: `
## Giới thiệu chương trình

University of Queensland là thành viên Group of Eight với thế mạnh về khoa học và kỹ thuật.

## Chuyên ngành
- Civil Engineering
- Electrical Engineering
- Mechanical Engineering
- Software Engineering

## Cơ hội nghề nghiệp
- Kỹ sư tại các tập đoàn lớn
- Visa làm việc 2-4 năm sau tốt nghiệp
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 44000,
    priceTo: 50000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
  {
    title: 'Deakin University - Master of Cybersecurity',
    slug: 'deakin-university-cybersecurity',
    excerpt: 'Chương trình Thạc sĩ An ninh mạng tại Deakin - trường đại học hàng đầu về công nghệ thông tin. Học bổng 25% học phí.',
    content: `
## Giới thiệu chương trình

Deakin University nổi tiếng với chất lượng giảng dạy và cơ sở vật chất hiện đại.

## Nội dung
- Network Security
- Ethical Hacking
- Digital Forensics
- Cloud Security

## Học bổng
- Deakin International Scholarship: 25% học phí
- Vice-Chancellor's Scholarship: 100% học phí
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 38000,
    priceTo: 44000,
    priceCurrency: 'AUD',
    itinerary: 'March, July, November',
    isPublished: true,
  },
  {
    title: 'William Angliss Institute - Diploma of Hospitality Management',
    slug: 'william-angliss-hospitality',
    excerpt: 'Chương trình Quản trị Khách sạn tại trường chuyên đào tạo du lịch khách sạn hàng đầu Úc. Thực tập hưởng lương.',
    content: `
## Giới thiệu chương trình

William Angliss là trường chuyên đào tạo về du lịch, khách sạn và ẩm thực lớn nhất Úc.

## Ưu điểm
- Thực tập hưởng lương
- Cơ hội việc làm cao
- Kết nối với ngành công nghiệp
- Định cư theo nghề

## Yêu cầu
- IELTS 5.5+
- Tốt nghiệp THPT
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'vocational',
    priceFrom: 15000,
    priceTo: 20000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
  {
    title: 'UNSW Sydney - Master of Finance',
    slug: 'unsw-master-finance',
    excerpt: 'Chương trình Thạc sĩ Tài chính tại UNSW Business School - top 20 thế giới về kinh doanh. Học bổng $10,000 AUD.',
    content: `
## Giới thiệu chương trình

UNSW Business School là một trong những trường kinh doanh hàng đầu thế giới.

## Chuyên ngành
- Corporate Finance
- Investment Banking
- Financial Technology
- Risk Management

## Đặc điểm
- Chương trình 1-2 năm
- Thực tập tại các ngân hàng lớn
- Mạng lưới cựu sinh viên toàn cầu
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 46000,
    priceTo: 52000,
    priceCurrency: 'AUD',
    itinerary: 'February, May, September',
    isPublished: true,
  },
  {
    title: 'Queensland University of Technology - Bachelor of Nursing',
    slug: 'qut-nursing',
    excerpt: 'Chương trình Cử nhân Điều dưỡng tại QUT - cơ hội việc làm cao và định cư tại Úc với nghề y tế.',
    content: `
## Giới thiệu chương trình

QUT là trường đại học nổi tiếng với các chương trình thực hành và cơ hội việc làm cao.

## Ưu điểm
- Nghề y tế được ưu tiên định cư
- Thực tập tại bệnh viện
- Việc làm sau tốt nghiệp gần như 100%
- Lương cao sau khi tốt nghiệp

## Yêu cầu
- IELTS 7.0 (mỗi kỹ năng 7.0)
- Học sinh giỏi các môn khoa học
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 32000,
    priceTo: 38000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
  {
    title: 'University of Technology Sydney - Master of IT',
    slug: 'uts-master-it',
    excerpt: 'Chương trình Thạc sĩ Công nghệ thông tin tại UTS - trường đại học công nghệ hàng đầu Sydney. Học bổng 30% học phí.',
    content: `
## Giới thiệu chương trình

UTS là trường đại học công nghệ hàng đầu với cơ sở vật chất hiện đại và kết nối ngành công nghiệp mạnh mẽ.

## Chuyên ngành
- Software Engineering
- Data Analytics
- Cybersecurity
- Enterprise Systems

## Học bổng
- UTS International Scholarship: 30% học phí
- Academic Excellence Award: $5,000 - $10,000
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'university',
    priceFrom: 40000,
    priceTo: 46000,
    priceCurrency: 'AUD',
    itinerary: 'February, July, October',
    isPublished: true,
  },
  {
    title: 'Box Hill Institute - Certificate III in Automotive',
    slug: 'box-hill-automotive',
    excerpt: 'Chương trình Du học nghề Ô tô tại Box Hill Institute Melbourne. Cơ hội việc làm và định cư cao.',
    content: `
## Giới thiệu chương trình

Box Hill Institute là trường nghề uy tín tại Melbourne với các chương trình đào tạo thực hành.

## Ưu điểm
- Chi phí thấp
- Thực hành nhiều
- Nghề tay nghề cao - dễ định cư
- Việc làm ổn định

## Yêu cầu
- IELTS 5.5+
- Tốt nghiệp THPT
    `,
    type: 'study' as const,
    country: 'australia',
    studyType: 'vocational',
    priceFrom: 10000,
    priceTo: 15000,
    priceCurrency: 'AUD',
    itinerary: 'February, July',
    isPublished: true,
  },
]

@Injectable()
export class NewsSeed implements OnModuleInit {
  private readonly logger = new Logger(NewsSeed.name)

  constructor(
    @InjectRepository(News)
    private readonly newsRepo: Repository<News>,
  ) {}

  async onModuleInit() {
    this.logger.log('Seeding study programs...')
    await this.seedStudyPrograms()
  }

  private async seedStudyPrograms() {
    try {
      let created = 0
      let updated = 0

      for (const programData of SAMPLE_STUDY_PROGRAMS) {
        const existing = await this.newsRepo.findOne({
          where: { slug: programData.slug },
        })

        if (existing) {
          await this.newsRepo.update(existing.id, programData)
          updated++
        } else {
          const program = this.newsRepo.create(programData)
          await this.newsRepo.save(program)
          created++
        }
      }

      this.logger.log(`Seeded study programs: ${created} created, ${updated} updated`)
    } catch (error) {
      this.logger.error('Failed to seed study programs', error)
    }
  }
}
