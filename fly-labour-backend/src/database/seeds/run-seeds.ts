import { DataSource } from 'typeorm'
import * as bcrypt from 'bcryptjs'
import * as dotenv from 'dotenv'
dotenv.config()

// Import entities
import { User, UserRole } from '../../modules/users/user.entity'
import { Category } from '../../modules/categories/category.entity'
import { Job, JobType, JobStatus } from '../../modules/jobs/job.entity'
import { News } from '../../modules/news/news.entity'

async function seed() {
  const databaseUrl = process.env.DATABASE_URL

  const AppDataSource = new DataSource(
    databaseUrl
      ? {
          type: 'postgres',
          url: databaseUrl,
          ssl: { rejectUnauthorized: false },
          entities: [User, Category, Job, News],
          synchronize: true,
          extra: { max: 2, connectionTimeoutMillis: 10000 },
        }
      : {
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USERNAME || 'postgres',
          password: process.env.DB_PASSWORD || '123456',
          database: process.env.DB_NAME || 'fly_labour',
          entities: [User, Category, Job, News],
          synchronize: true,
        }
  )

  await AppDataSource.initialize()
  console.log('🌱 Bắt đầu seed dữ liệu...')



  // ── 4. News ──
  const newsRepo = AppDataSource.getRepository(News)
  const newsCount = await newsRepo.count()
  if (newsCount === 0) {
    await newsRepo.save([
      newsRepo.create({
        title: 'Chính sách visa lao động Úc 2025 có gì mới?',
        slug: 'visa-uc-2025',
        excerpt: 'Chính phủ Úc vừa công bố một số thay đổi quan trọng trong chính sách visa lao động năm 2025...',
        content: 'Nội dung chi tiết về chính sách visa Úc 2025...',
        isPublished: true,
      }),
      newsRepo.create({
        title: 'Top 5 ngành nghề dễ xin việc tại Canada năm 2025',
        slug: 'nganh-nghe-canada-2025',
        excerpt: 'Canada đang thiếu hụt lao động trầm trọng trong nhiều ngành. Đây là cơ hội vàng cho lao động Việt Nam...',
        content: 'Nội dung chi tiết về các ngành nghề tại Canada...',
        isPublished: true,
      }),
      newsRepo.create({
        title: 'Kinh nghiệm chuẩn bị hồ sơ xin việc tại New Zealand',
        slug: 'ho-so-new-zealand',
        excerpt: 'Bộ hồ sơ hoàn chỉnh là chìa khóa để được nhà tuyển dụng New Zealand chú ý...',
        content: 'Nội dung chi tiết về hồ sơ xin việc NZ...',
        isPublished: true,
      }),
    ])
    console.log('✅ Tạo 3 tin tức mẫu')
  }

// ── 5. Travel Tours (Tour du lịch) ──
  const travelToursToSeed = [
    {
      title: 'Tour Hàn Quốc 5N4Đ - Seoul / Nami / Everland',
      slug: 'tour-han-quoc-5n4d',
      excerpt: 'Gói phổ thông phù hợp gia đình, lịch trình nhẹ, khách sạn 3-4 sao.',
      content: '<p>📍 <strong>Lộ trình chi tiết:</strong></p><ul><li><strong>Ngày 1:</strong> TP. Hồ Chí Minh → Seoul (Núi Namsan, check-in khách sạn)</li><li><strong>Ngày 2:</strong> Seoul → Nami Island (đảo Nami, cây thông trắng) → Quay lại Seoul</li><li><strong>Ngày 3:</strong> Everland (công viên giải trí lớn nhất Hàn Quốc)</li><li><strong>Ngày 4:</strong> Shopping tại Myeongdong → Viện bảo tàng kim chi</li><li><strong>Ngày 5:</strong> Tự do → Ra sân bay về VN</li></ul><p>✅ <strong>Bao gồm:</strong> Vé máy bay khứ hồi, khách sạn 3-4 sao, xe đưa đón, vé tham quan chính, hướng dẫn viên tiếng Việt.</p><p>❌ <strong>Không bao gồm:</strong> Phí visa, ăn uống ngoài chương trình, tip HDV.</p>',
      image: 'https://images.unsplash.com/photo-1538485399081-7c8976f33827?w=1200&q=80&fit=crop',
      type: 'travel' as const,
      country: 'south_korea',
      priceFrom: 14900000,
      priceTo: 18900000,
      priceCurrency: 'VND',
      itinerary: 'Seoul - Nami - Everland - Shopping - Về VN',
      registerUrl: '',
      isPublished: true,
    },
    {
      title: 'Tour Nhật Bản 6N5Đ - Tokyo / Fuji / Osaka',
      slug: 'tour-nhat-ban-6n5d',
      excerpt: 'Lộ trình vàng mùa hoa, tối ưu điểm check-in và mua sắm.',
      content: '<p>📍 <strong>Lộ trình chi tiết:</strong></p><ul><li><strong>Ngày 1:</strong> TP. Hồ Chí Minh → Tokyo (Narita/Haneda)</li><li><strong>Ngày 2:</strong> Tokyo city tour (Senso-ji, Shibuya, Harajuku)</li><li><strong>Ngày 3:</strong> Mount Fuji (Phú Sĩ) - Kawaguchiko - Hakone</li><li><strong>Ngày 4:</strong> Osaka - Dotonbori - Universal Studios</li><li><strong>Ngày 5:</strong> Kyoto - Fushimi Inari - Arashiyama</li><li><strong>Ngày 6:</strong> Kansai → Ra sân bay về VN</li></ul><p>✅ <strong>Bao gồm:</strong> Hướng dẫn viên tiếng Việt, ăn theo chương trình, tặng sim data du lịch, vé máy bay khứ hồi.</p>',
      image: 'https://images.unsplash.com/photo-1492571350019-22de08371fd3?w=1200&q=80&fit=crop',
      type: 'travel' as const,
      country: 'japan',
      priceFrom: 28900000,
      priceTo: 35900000,
      priceCurrency: 'VND',
      itinerary: 'Tokyo - Asakusa - Fuji - Kyoto - Osaka - Kansai',
      registerUrl: '',
      isPublished: true,
    },
    {
      title: 'Tour Úc 7N6Đ - Sydney / Melbourne / Blue Mountains',
      slug: 'tour-uc-7n6d',
      excerpt: 'Hành trình chuẩn premium, phù hợp gia đình và trải nghiệm city + thiên nhiên.',
      content: '<p>📍 <strong>Lộ trình chi tiết:</strong></p><ul><li><strong>Ngày 1:</strong> TP. Hồ Chí Minh → Sydney</li><li><strong>Ngày 2:</strong> Sydney (Sydney Opera House, Harbour Bridge)</li><li><strong>Ngày 3:</strong> Blue Mountains (núi xanh)</li><li><strong>Ngày 4:</strong> Melbourne city tour</li><li><strong>Ngày 5:</strong> Great Ocean Road (12 Apostles)</li><li><strong>Ngày 6:</strong> Penguin Parade (Phillip Island)</li><li><strong>Ngày 7:</strong> Melbourne → Về VN</li></ul><p>✅ <strong>Bao gồm:</strong> Vé máy bay khứ hồi, khách sạn trung tâm, city tour, hướng dẫn viên tiếng Việt.</p>',
      image: 'https://images.unsplash.com/photo-1523482580672-f109ba8cb9be?w=1200&q=80&fit=crop',
      type: 'travel' as const,
      country: 'australia',
      priceFrom: 42900000,
      priceTo: 52900000,
      priceCurrency: 'VND',
      itinerary: 'Sydney - Opera House - Blue Mountains - Melbourne - Great Ocean Road',
      registerUrl: '',
      isPublished: true,
    },
    {
      title: 'Tour Châu Âu 10N9Đ - Pháp / Ý / Thụy Sĩ',
      slug: 'tour-chau-au-10n9d',
      excerpt: 'Lộ trình liên tuyến nổi bật, tối ưu thời gian và chi phí visa Schengen.',
      content: '<p>📍 <strong>Lộ trình chi tiết:</strong></p><ul><li><strong>Ngày 1-2:</strong> Paris (Eiffel, Louvre, Notre Dame)</li><li><strong>Ngày 3:</strong> Disneyland Paris</li><li><strong>Ngày 4:</strong> Paris → Lucerne (Thụy Sĩ)</li><li><strong>Ngày 5:</strong> Interlaken - Jungfrau</li><li><strong>Ngày 6:</strong> Lucerne → Milan (Ý)</li><li><strong>Ngày 7:</strong> Venice</li><li><strong>Ngày 8:</strong> Florence</li><li><strong>Ngày 9:</strong> Rome (Colosseum, Vatican)</li><li><strong>Ngày 10:</strong> Rome → Về VN</li></ul><p>✅ <strong>Bao gồm:</strong> Khách sạn 4 sao, xe liên quốc gia, hỗ trợ thủ tục visa.</p>',
      image: 'https://images.unsplash.com/photo-1491557345352-5929e343eb89?w=1200&q=80&fit=crop',
      type: 'travel' as const,
      country: 'europe',
      priceFrom: 69900000,
      priceTo: 89900000,
      priceCurrency: 'VND',
      itinerary: 'Paris - Lucerne - Interlaken - Milan - Venice - Rome',
      registerUrl: '',
      isPublished: true,
    },
    {
      title: 'Tour Singapore 4N3Đ - Sentosa / Marina Bay',
      slug: 'tour-singapore-4n3d',
      excerpt: 'Tour ngắn ngày, lịch trình nhẹ phù hợp gia đình có trẻ nhỏ.',
      content: '<p>📍 <strong>Lộ trình chi tiết:</strong></p><ul><li><strong>Ngày 1:</strong> TP. Hồ Chí Minh → Singapore (Gardens by the Bay)</li><li><strong>Ngày 2:</strong> Universal Studios Singapore</li><li><strong>Ngày 3:</strong> Sentosa - Beach - S.E.A Aquarium</li><li><strong>Ngày 4:</strong> Shopping Orchard → Về VN</li></ul><p>✅ <strong>Bao gồm:</strong> Combo vé tham quan Universal Studios, city tour, hỗ trợ hoàn thuế mua sắm, hướng dẫn viên.</p>',
      image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?w=1200&q=80&fit=crop',
      type: 'travel' as const,
      country: 'singapore',
      priceFrom: 15900000,
      priceTo: 21900000,
      priceCurrency: 'VND',
      itinerary: 'Marina Bay - Gardens by the Bay - Sentosa - Universal Studios',
      registerUrl: '',
      isPublished: true,
    },
  ]

  for (const tour of travelToursToSeed) {
    const exist = await newsRepo.findOne({ where: { slug: tour.slug } })
    if (!exist) {
      await newsRepo.save(newsRepo.create(tour))
      console.log(`✅ Đã seed tour du lịch: ${tour.title}`)
    } else {
      console.log(`⏭️  Tour du lịch đã tồn tại: ${tour.title}`)
    }
  }

// ── 6. Study Programs (Đơn du học) ──
  // Import danh sách trường đại học Úc từ file JSON
  const australianUniversities: Array<{
    name: string
    url: string
    locations: string[]
    tuition_fee_range_aud: string
    is_group_of_eight: boolean
  }> = require('../../../australian_universities_seed.json')

  // Import danh sách trường đại học Canada từ file JSON
  const canadianUniversities: Array<{
    ten_truong_vi: string
    ten_truong_en: string
    tinh_bang: string
    trang_web: string
    hoc_phi_uoc_tinh_cad: string
    loai_truong: string
  }> = require('../../../canadian_universities_seed.json')

  // Hàm tạo slug từ tên trường
  function makeSlug(name: string): string {
    return name
      .toLowerCase()
      .replace(/[()]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .slice(0, 80)
  }

  // Hàm parse tuition fee range "35,000 - 50,000" → { from: 35000, to: 50000 }
  function parseFeeRange(range: string): { from: number; to: number } {
    const parts = range.split('-').map(s => parseInt(s.replace(/,/g, '').trim(), 10))
    return { from: parts[0] || 0, to: parts[1] || parts[0] || 0 }
  }

  // Unsplash images xoay vòng cho các trường Úc
  const uniImages = [
    'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=75',
    'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=75',
    'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=75',
    'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=75',
    'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=75',
    'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=75',
    'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=75',
    'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=800&q=75',
  ]

  // Unsplash images xoay vòng cho các trường Canada
  const canadaUniImages = [
    'https://images.unsplash.com/photo-1503614472-8c93d56e92ce?w=800&q=75',
    'https://images.unsplash.com/photo-1517935706615-2717063c2225?w=800&q=75',
    'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&q=75',
    'https://images.unsplash.com/photo-1551009175-15bdf9dcb580?w=800&q=75',
    'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=800&q=75',
    'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75',
    'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=800&q=75',
    'https://images.unsplash.com/photo-1590012314607-cda9d9b699ae?w=800&q=75',
  ]

  // Tạo seed data cho tất cả trường đại học Úc từ JSON
  const australianUniSeeds = australianUniversities.map((uni, idx) => {
    const fees = parseFeeRange(uni.tuition_fee_range_aud)
    const go8Label = uni.is_group_of_eight ? ' — thành viên Group of Eight (Go8)' : ''
    const locationStr = uni.locations.join(', ')

    return {
      title: `${uni.name} — Chương trình Cử nhân & Thạc sĩ`,
      slug: makeSlug(uni.name),
      excerpt: `Trường đại học tại ${locationStr}, Úc${go8Label}. Học phí từ ${uni.tuition_fee_range_aud} AUD/năm. Đăng ký qua Fly Visa để được hỗ trợ hồ sơ miễn phí.`,
      content: `<p><strong>${uni.name}</strong> tọa lạc tại ${locationStr}, là một trong những trường đại học ${uni.is_group_of_eight ? 'nghiên cứu hàng đầu nước Úc, thuộc nhóm Group of Eight danh tiếng' : 'uy tín tại Úc'}. Trường đào tạo đa dạng các chuyên ngành từ Kinh tế, Kỹ thuật, Công nghệ thông tin, Y khoa đến Khoa học xã hội và Nghệ thuật.</p><p>Học phí tham khảo: <strong>${uni.tuition_fee_range_aud} AUD/năm</strong> tùy ngành. Học viên đăng ký qua hệ thống Fly Visa sẽ được tư vấn chuyên sâu về học bổng, hỗ trợ hoàn thiện hồ sơ xin visa du học miễn phí.</p><p>🔗 Website trường: <a href="${uni.url}" target="_blank">${uni.url}</a></p>`,
      image: uniImages[idx % uniImages.length],
      type: 'study' as const,
      country: 'australia',
      studyType: 'university',
      priceFrom: fees.from,
      priceTo: fees.to,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: uni.url,
      isPublished: true,
    }
  })

  // Tạo seed data cho tất cả trường đại học Canada từ JSON
  const canadianUniSeeds = canadianUniversities.map((uni, idx) => {
    const fees = parseFeeRange(uni.hoc_phi_uoc_tinh_cad)

    return {
      title: `${uni.ten_truong_vi} (${uni.ten_truong_en}) — Chương trình Cử nhân & Thạc sĩ`,
      slug: makeSlug(uni.ten_truong_en),
      excerpt: `${uni.ten_truong_vi} tại ${uni.tinh_bang}, Canada. Trường ${uni.loai_truong}. Học phí từ ${uni.hoc_phi_uoc_tinh_cad} CAD/năm. Đăng ký qua Fly Visa để được hỗ trợ hồ sơ miễn phí.`,
      content: `<p><strong>${uni.ten_truong_vi} (${uni.ten_truong_en})</strong> tọa lạc tại bang ${uni.tinh_bang}, Canada. Đây là trường đại học ${uni.loai_truong.toLowerCase()} uy tín, đào tạo đa dạng các chuyên ngành từ Kinh tế, Kỹ thuật, Công nghệ thông tin, Y khoa đến Khoa học xã hội và Nghệ thuật.</p><p>Học phí tham khảo: <strong>${uni.hoc_phi_uoc_tinh_cad} CAD/năm</strong> tùy ngành. Sinh viên quốc tế có cơ hội xin giấy phép làm việc sau tốt nghiệp (PGWP) và lộ trình định cư tại Canada.</p><p>Học viên đăng ký qua hệ thống Fly Visa sẽ được tư vấn chuyên sâu về học bổng, hỗ trợ hoàn thiện hồ sơ xin visa du học miễn phí.</p><p>🔗 Website trường: <a href="${uni.trang_web}" target="_blank">${uni.trang_web}</a></p>`,
      image: canadaUniImages[idx % canadaUniImages.length],
      type: 'study' as const,
      country: 'canada',
      studyType: 'university',
      priceFrom: fees.from,
      priceTo: fees.to,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học Tháng 1, Tháng 5 và Tháng 9 hàng năm',
      registerUrl: uni.trang_web,
      isPublished: true,
    }
  })

  const studyProgramsToSeed = [
    // Các trường đại học Úc từ file JSON
    ...australianUniSeeds,

    // Các trường đại học Canada từ file JSON
    ...canadianUniSeeds,

    // ── Các trường Cao đẳng / TAFE tại Úc ──
    {
      title: 'TAFE NSW — Cao đẳng nghề lớn nhất nước Úc',
      slug: 'tafe-nsw',
      excerpt: 'Hệ thống TAFE lớn nhất Úc với hơn 130 campus tại New South Wales. Đào tạo hơn 1.200 khóa học nghề từ Bếp, IT, Điều dưỡng đến Xây dựng.',
      content: '<p><strong>TAFE NSW</strong> là hệ thống giáo dục nghề nghiệp công lập lớn nhất nước Úc, trực thuộc chính phủ bang New South Wales. Với hơn 130 campus trải khắp NSW, TAFE NSW đào tạo hàng trăm nghìn sinh viên mỗi năm.</p><p>Các ngành học phổ biến: Bếp thương mại, CNTT, Điều dưỡng, Xây dựng, Cơ khí ô tô, Thiết kế, Kế toán. Sinh viên quốc tế được hỗ trợ việc làm thực tập và có lộ trình chuyển tiếp lên đại học.</p><p>🔗 Website: <a href="https://www.tafensw.edu.au" target="_blank">tafensw.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 12000,
      priceTo: 22000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.tafensw.edu.au',
      isPublished: true,
    },
    {
      title: 'TAFE Queensland — Cao đẳng nghề hàng đầu Queensland',
      slug: 'tafe-queensland',
      excerpt: 'Hệ thống TAFE công lập lớn nhất bang Queensland với hơn 50 campus. Chương trình đào tạo nghề chất lượng cao, cơ hội việc làm rộng mở.',
      content: '<p><strong>TAFE Queensland</strong> là nhà cung cấp đào tạo nghề lớn nhất bang Queensland, cung cấp hơn 500 khóa học từ chứng chỉ đến cao đẳng nâng cao.</p><p>Các ngành nổi bật: Du lịch & Khách sạn, Bếp, Điều dưỡng, Nông nghiệp, Xây dựng, CNTT. Sinh viên tốt nghiệp có tỷ lệ có việc làm rất cao tại Queensland.</p><p>🔗 Website: <a href="https://tafeqld.edu.au" target="_blank">tafeqld.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 12000,
      priceTo: 20000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://tafeqld.edu.au',
      isPublished: true,
    },
    {
      title: 'Box Hill Institute — Cao đẳng nghề uy tín tại Melbourne',
      slug: 'box-hill-institute',
      excerpt: 'Trường cao đẳng công lập tại Melbourne với hơn 50 năm kinh nghiệm đào tạo nghề. Nổi tiếng với ngành Ô tô, Bếp, IT và Điều dưỡng.',
      content: '<p><strong>Box Hill Institute</strong> là một trong những trường cao đẳng công lập uy tín nhất tại Victoria, Australia. Trường có hơn 50 năm kinh nghiệm đào tạo với các cơ sở hiện đại tại Melbourne.</p><p>Các ngành đào tạo nổi bật: Cơ khí ô tô, Bếp thương mại, Công nghệ thông tin, Điều dưỡng, Thiết kế đồ họa. Chương trình thực tập hưởng lương giúp sinh viên có kinh nghiệm thực tế.</p><p>🔗 Website: <a href="https://www.boxhill.edu.au" target="_blank">boxhill.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1498243691581-b145c3f54a5a?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 13000,
      priceTo: 20000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.boxhill.edu.au',
      isPublished: true,
    },
    {
      title: 'Holmesglen Institute — Cao đẳng đa ngành tại Victoria',
      slug: 'holmesglen-institute',
      excerpt: 'Trường cao đẳng công lập lớn tại Melbourne với hơn 600 khóa học. Cơ sở vật chất hiện đại, hỗ trợ sinh viên quốc tế toàn diện.',
      content: '<p><strong>Holmesglen Institute</strong> là một trong những trường cao đẳng lớn nhất Victoria với 5 campus tại khu vực Melbourne. Trường cung cấp hơn 600 khóa học từ chứng chỉ nghề đến cử nhân ứng dụng.</p><p>Ngành học phổ biến: Xây dựng, Điều dưỡng, Du lịch khách sạn, CNTT, Kế toán, Thiết kế nội thất. Sinh viên quốc tế được hỗ trợ tìm việc và chuyển tiếp lên đại học đối tác.</p><p>🔗 Website: <a href="https://holmesglen.edu.au" target="_blank">holmesglen.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 12000,
      priceTo: 19000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://holmesglen.edu.au',
      isPublished: true,
    },
    {
      title: 'Melbourne Polytechnic — Cao đẳng bách khoa Melbourne',
      slug: 'melbourne-polytechnic',
      excerpt: 'Trường cao đẳng công lập với lịch sử hơn 100 năm tại Melbourne. Đào tạo nghề chất lượng cao với mức học phí hợp lý.',
      content: '<p><strong>Melbourne Polytechnic</strong> là trường cao đẳng công lập có lịch sử hơn 100 năm, cung cấp đào tạo từ chứng chỉ nghề đến bằng cử nhân ứng dụng.</p><p>Ngành nổi bật: Kỹ thuật điện, Cơ khí, Làm đẹp & Spa, Bếp, CNTT, Nông nghiệp. Trường có mối quan hệ chặt chẽ với các doanh nghiệp địa phương, đảm bảo cơ hội thực tập và việc làm cho sinh viên.</p><p>🔗 Website: <a href="https://www.melbournepolytechnic.edu.au" target="_blank">melbournepolytechnic.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1580537659466-0a9bfa916a54?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 11000,
      priceTo: 18000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.melbournepolytechnic.edu.au',
      isPublished: true,
    },
    {
      title: 'South Metropolitan TAFE — Cao đẳng nghề hàng đầu Perth',
      slug: 'south-metropolitan-tafe',
      excerpt: 'Trường TAFE công lập lớn nhất tại Perth, Western Australia. Đào tạo nghề chất lượng với chi phí sinh hoạt thấp hơn Sydney và Melbourne.',
      content: '<p><strong>South Metropolitan TAFE</strong> là một trong những trường TAFE lớn nhất Western Australia, phục vụ hơn 30.000 sinh viên mỗi năm tại nhiều campus ở Perth và khu vực phía nam.</p><p>Ngành học nổi bật: Hàn & Cơ khí, Xây dựng, Điện, Bếp, Du lịch, Y tế. Perth có chi phí sinh hoạt thấp hơn đáng kể so với Sydney/Melbourne, giúp sinh viên tiết kiệm chi phí.</p><p>🔗 Website: <a href="https://www.southmetrotafe.wa.edu.au" target="_blank">southmetrotafe.wa.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1568792923760-d70635a89fdc?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 10000,
      priceTo: 17000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.southmetrotafe.wa.edu.au',
      isPublished: true,
    },
    {
      title: 'William Angliss Institute — Cao đẳng chuyên ngành Nhà hàng Khách sạn',
      slug: 'william-angliss-institute',
      excerpt: 'Trường cao đẳng chuyên ngành Du lịch, Khách sạn và Ẩm thực hàng đầu tại Úc. Nằm ngay trung tâm Melbourne.',
      content: '<p><strong>William Angliss Institute</strong> là trường cao đẳng chuyên biệt hàng đầu nước Úc về Du lịch, Khách sạn, Ẩm thực và Sự kiện. Trường nằm ngay trung tâm Melbourne CBD.</p><p>Ngành đào tạo: Bếp thương mại, Làm bánh, Quản trị khách sạn, Du lịch, Tổ chức sự kiện, Quản lý nhà hàng. Sinh viên được thực tập tại các nhà hàng và khách sạn 5 sao đối tác.</p><p>🔗 Website: <a href="https://www.angliss.edu.au" target="_blank">angliss.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 14000,
      priceTo: 22000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.angliss.edu.au',
      isPublished: true,
    },
    {
      title: 'TAFE SA (South Australia) — Cao đẳng nghề Adelaide',
      slug: 'tafe-sa',
      excerpt: 'Hệ thống TAFE công lập tại South Australia. Chi phí sinh hoạt thấp, chất lượng đào tạo cao, cơ hội định cư tốt tại Adelaide.',
      content: '<p><strong>TAFE SA</strong> là hệ thống giáo dục nghề nghiệp công lập chính thức của bang South Australia, cung cấp hàng trăm khóa học tại các campus ở Adelaide và vùng phụ cận.</p><p>Ngành học phổ biến: Điều dưỡng, Bếp, Nha khoa, CNTT, Xây dựng, Kế toán. Adelaide nằm trong danh sách vùng regional của Úc, giúp sinh viên có thêm điểm cộng khi xin PR.</p><p>🔗 Website: <a href="https://www.tafesa.edu.au" target="_blank">tafesa.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 10000,
      priceTo: 18000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.tafesa.edu.au',
      isPublished: true,
    },
    {
      title: 'Kangan Institute — Cao đẳng nghề Ô tô & Kỹ thuật Melbourne',
      slug: 'kangan-institute',
      excerpt: 'Trường cao đẳng công lập nổi tiếng về đào tạo Cơ khí ô tô, Kỹ thuật và Sức khỏe tại Melbourne. Cơ sở thực hành hiện đại.',
      content: '<p><strong>Kangan Institute</strong> là trường cao đẳng công lập tại Melbourne, nổi tiếng với chương trình đào tạo kỹ thuật ô tô hàng đầu nước Úc. Trường có xưởng thực hành hiện đại đạt tiêu chuẩn công nghiệp.</p><p>Ngành nổi bật: Cơ khí ô tô, Kỹ thuật điện, Điều dưỡng, Sức khỏe cộng đồng, Thời trang. Sinh viên được đào tạo thực hành 70% thời gian, đảm bảo kỹ năng làm việc ngay sau tốt nghiệp.</p><p>🔗 Website: <a href="https://www.kangan.edu.au" target="_blank">kangan.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 12000,
      priceTo: 19000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.kangan.edu.au',
      isPublished: true,
    },
    {
      title: 'Chisholm Institute — Cao đẳng đa ngành tại Melbourne',
      slug: 'chisholm-institute',
      excerpt: 'Trường cao đẳng công lập lớn tại khu vực đông nam Melbourne. Đào tạo hơn 400 khóa học nghề với cơ sở vật chất tiên tiến.',
      content: '<p><strong>Chisholm Institute</strong> là một trong những trường cao đẳng công lập lớn nhất Victoria, phục vụ hơn 40.000 sinh viên mỗi năm tại các campus ở khu vực đông nam Melbourne.</p><p>Ngành đào tạo: Xây dựng, Điện & Điện tử, Bếp, Làm đẹp, CNTT, Kế toán, Điều dưỡng. Trường có chương trình hỗ trợ sinh viên quốc tế toàn diện và lộ trình chuyển tiếp lên đại học Monash, Deakin.</p><p>🔗 Website: <a href="https://www.chisholm.edu.au" target="_blank">chisholm.edu.au</a></p>',
      image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'college',
      priceFrom: 11000,
      priceTo: 18000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học Tháng 2 và Tháng 7 hàng năm',
      registerUrl: 'https://www.chisholm.edu.au',
      isPublished: true,
    },

    // Các chương trình du học khác (non-Úc & nghề)
    {
      title: 'Cao đẳng Langara Canada - Lộ trình chuyển tiếp Đại học hàng đầu',
      slug: 'cao-dang-langara-canada',
      excerpt: 'Học tập tại Vancouver với chương trình Cao đẳng liên thông Đại học chất lượng cao, cơ hội làm việc và định cư hấp dẫn.',
      content: '<p>Cao đẳng Langara (Langara College) là một trong những cơ sở đào tạo chuyển tiếp đại học hàng đầu của Canada, thu hút hàng ngàn sinh viên quốc tế mỗi năm. Chương trình giúp tiết kiệm học phí tối đa trước khi chuyển tiếp vào các đại học lớn như UBC, SFU.</p><p>Sinh viên sau khi tốt nghiệp chương trình 2 năm được cấp giấy phép làm việc (PGWP) lên tới 3 năm để tích lũy kinh nghiệm định cư.</p>',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=75',
      type: 'study' as const,
      country: 'canada',
      studyType: 'college',
      priceFrom: 16000,
      priceTo: 22000,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học Tháng 1, Tháng 5 và Tháng 9',
      registerUrl: 'https://langara.ca',
      isPublished: true,
    },
    {
      title: 'Cao đẳng Seneca Canada — Đào tạo ứng dụng hàng đầu Toronto',
      slug: 'cao-dang-seneca-canada',
      excerpt: 'Học tập tại Toronto với chương trình Cao đẳng công lập lớn bậc nhất Canada, thế mạnh về Kinh doanh, Công nghệ và Truyền thông.',
      content: '<p><strong>Cao đẳng Seneca (Seneca College)</strong> là một trong những trường cao đẳng công lập lớn nhất và đi đầu về đào tạo thực hành ứng dụng tại Canada, tọa lạc tại thành phố Toronto năng động.</p><p>Trường cung cấp các chương trình Cao đẳng (Diploma), Đại học (Bachelor) và Sau đại học (Post-Graduate) với các ngành học thế mạnh: Quản trị Kinh doanh, Công nghệ Thông tin, Thiết kế Đồ họa, Hàng không và Khoa học Y sinh. Sinh viên tốt nghiệp từ chương trình 2 năm trở lên được cấp giấy phép làm việc PGWP lên đến 3 năm và rộng mở cơ hội định cư bang Ontario.</p><p>🔗 Website: <a href="https://www.senecapolytechnic.ca" target="_blank">senecapolytechnic.ca</a></p>',
      image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=75',
      type: 'study' as const,
      country: 'canada',
      studyType: 'college',
      priceFrom: 16000,
      priceTo: 22000,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học Tháng 1, Tháng 5 và Tháng 9',
      registerUrl: 'https://www.senecapolytechnic.ca',
      isPublished: true,
    },
    {
      title: 'Cao đẳng Humber Canada — Học viện Công nghệ & Học tập Nâng cao',
      slug: 'cao-dang-humber-canada',
      excerpt: 'Cơ sở giáo dục polytechnic lớn nhất Toronto với 83% sinh viên có việc làm ngay trong vòng 6 tháng sau khi tốt nghiệp.',
      content: '<p><strong>Học viện Humber (Humber College / Humber Institute of Technology and Advanced Learning)</strong> là một trong những cơ sở giáo dục công lập lớn nhất và uy tín nhất Canada tại Toronto, bang Ontario.</p><p>Humber nổi tiếng với phương pháp đào tạo tích hợp lý thuyết và thực hành (co-op thực tập hưởng lương). Các ngành học nổi bật bao gồm: Quản trị Du lịch - Khách sạn, Khoa học Máy tính, Thiết kế Truyền thông và Kỹ thuật Cơ khí. Trường có liên kết đối tác rộng rãi với các doanh nghiệp lớn, đem lại cơ hội việc làm thực tế tuyệt vời.</p><p>🔗 Website: <a href="https://humber.ca" target="_blank">humber.ca</a></p>',
      image: 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=75',
      type: 'study' as const,
      country: 'canada',
      studyType: 'college',
      priceFrom: 16500,
      priceTo: 23000,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học Tháng 1, Tháng 5 và Tháng 9',
      registerUrl: 'https://humber.ca',
      isPublished: true,
    },
    {
      title: 'Cao đẳng Douglas Canada — Cao đẳng Công lập lớn nhất Vancouver',
      slug: 'cao-dang-douglas-canada',
      excerpt: 'Học phí hợp lý, lớp học quy mô nhỏ và lộ trình chuyển tiếp hoàn hảo lên các đại học danh tiếng tại British Columbia.',
      content: '<p><strong>Cao đẳng Douglas (Douglas College)</strong> tọa lạc tại khu vực Metro Vancouver, bang British Columbia. Đây là trường cao đẳng công lập lớn nhất bang với thế mạnh kết hợp giữa nền tảng học thuật của trường đại học và kỹ năng thực hành của trường nghề.</p><p>Chương trình nổi bật: Quản trị Kinh doanh, Chăm sóc sức khỏe (Nursing), Khoa học Máy tính, Nghệ thuật Biểu diễn. Lớp học nhỏ giúp giảng viên tương tác trực tiếp với sinh viên tốt hơn. Douglas là lựa chọn hoàn hảo để chuyển tiếp lên Đại học British Columbia (UBC) hoặc Đại học Simon Fraser (SFU).</p><p>🔗 Website: <a href="https://www.douglascollege.ca" target="_blank">douglascollege.ca</a></p>',
      image: 'https://images.unsplash.com/photo-1519832979-6fa011b87667?w=800&q=75',
      type: 'study' as const,
      country: 'canada',
      studyType: 'college',
      priceFrom: 17000,
      priceTo: 21000,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học Tháng 1, Tháng 5 và Tháng 9',
      registerUrl: 'https://www.douglascollege.ca',
      isPublished: true,
    },
    {
      title: 'Cao đẳng Centennial Canada — Định hướng nghề nghiệp & Thực tập Co-op',
      slug: 'cao-dang-centennial-canada',
      excerpt: 'Trường cao đẳng đầu tiên của bang Ontario, nổi tiếng về đào tạo Kỹ thuật Ô tô, Hàng không, Công nghệ và Nghệ thuật Ẩm thực.',
      content: '<p><strong>Cao đẳng Centennial (Centennial College)</strong> được thành lập từ năm 1966, là trường cao đẳng công lập đầu tiên của bang Ontario. Trường nổi tiếng thế giới về chất lượng giảng dạy hướng nghiệp thực tế và hỗ trợ việc làm cho sinh viên.</p><p>Trường có các khu học xá hiện đại tại Toronto, cung cấp hơn 250 chương trình học. Thế mạnh đào tạo đặc biệt của trường là: Công nghệ Kỹ thuật Ô tô & Hàng không, Quản trị Nhà hàng - Khách sạn, Khoa học Máy tính và Truyền thông đa phương tiện. Phần lớn các ngành đều tích hợp kỳ thực tập Co-op bắt buộc để sinh viên có trải nghiệm thực tiễn.</p><p>🔗 Website: <a href="https://www.centennialcollege.ca" target="_blank">centennialcollege.ca</a></p>',
      image: 'https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=75',
      type: 'study' as const,
      country: 'canada',
      studyType: 'college',
      priceFrom: 16000,
      priceTo: 22000,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học Tháng 1, Tháng 5 và Tháng 9',
      registerUrl: 'https://www.centennialcollege.ca',
      isPublished: true,
    },
    {
      title: 'Du học nghề định cư Canada — Chương trình tay nghề kỹ thuật cao',
      slug: 'du-hoc-nghe-dinh-cu-canada',
      excerpt: 'Chương trình học nghề lấy chứng chỉ 1 - 2 năm các ngành kỹ thuật, xây dựng, cơ khí tại Canada với cơ hội định cư diện Skilled Trades cực lớn.',
      content: '<p>Chương trình du học nghề tại Canada tập trung vào các nhóm ngành đang thiếu hụt nhân lực trầm trọng, thuộc diện định cư ưu tiên (Skilled Trades) như: Điện, Hàn, Hàn xì, Lắp ráp đường ống, Kỹ thuật ô tô, Vận hành máy móc và Xây dựng.</p><p>Học viên tham gia khóa học nghề từ 1 - 2 năm tại các trường cao đẳng đối tác của Fly Visa. Sau khi hoàn thành khóa học, sinh viên sẽ được hỗ trợ xin Giấy phép lao động (Work Permit) để tích lũy kinh nghiệm làm việc thực tế, mở ra lộ trình nộp hồ sơ xin Thường trú nhân (PR) qua hệ thống Express Entry (nhóm Federal Skilled Trades Class) hoặc các chương trình Đề cử tỉnh bang (PNP).</p>',
      image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=75',
      type: 'study' as const,
      country: 'canada',
      studyType: 'vocational',
      priceFrom: 14000,
      priceTo: 19000,
      priceCurrency: 'CAD',
      itinerary: 'Kỳ nhập học linh hoạt theo từng trường đối tác',
      registerUrl: '',
      isPublished: true,
    },
    {
      title: 'Du học nghề Điều dưỡng tại Đức - Miễn 100% học phí & Trợ cấp cao',
      slug: 'du-hoc-nghe-dieu-duong-duc',
      excerpt: 'Học tập và làm việc tại các bệnh viện lớn ở Đức. Nhận lương học nghề từ 1.100 đến 1.300 EUR/tháng từ năm thứ nhất.',
      content: '<p>Chương trình du học nghề điều dưỡng Đức dành cho các bạn trẻ đã tốt nghiệp THPT, có sức khỏe tốt. Học viên được tài trợ hoàn toàn học phí chuyên ngành tại Đức trong suốt 3 năm học.</p><p>Vừa học vừa làm thực hành có trả lương. Sau tốt nghiệp cam kết có việc làm ngay với mức lương từ 2.800 đến 3.500 EUR/tháng và cơ hội định cư lâu dài sau 5 năm.</p>',
      image: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=800&q=75',
      type: 'study' as const,
      country: 'germany',
      studyType: 'vocational',
      priceFrom: 0,
      priceTo: 0,
      priceCurrency: 'EUR',
      itinerary: 'Nhập học Tháng 3 và Tháng 9 hàng năm',
      registerUrl: '',
      isPublished: true,
    },
    {
      title: 'Du học nghề Úc ngành Bếp thương mại & Quản trị Khách sạn',
      slug: 'du-hoc-nghe-bep-khach-san-uc',
      excerpt: 'Chương trình học nghề kết hợp thực tập hưởng lương hấp dẫn tại Sydney và Melbourne. Cơ hội làm việc lâu dài.',
      content: '<p>Chương trình đào tạo chứng chỉ nghề III, IV và Cao đẳng nâng cao ngành Bếp thương mại (Commercial Cookery) và Quản trị khách sạn tại Úc. Thời gian học linh hoạt, ưu tiên thực hành.</p><p>Học sinh được giới thiệu việc làm thực tập hưởng lương tại các nhà hàng, khách sạn đối tác của Fly Visa với mức thu nhập ổn định từ 25 - 30 AUD/giờ.</p>',
      image: 'https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&q=75',
      type: 'study' as const,
      country: 'australia',
      studyType: 'vocational',
      priceFrom: 12000,
      priceTo: 18000,
      priceCurrency: 'AUD',
      itinerary: 'Kỳ nhập học linh hoạt: Tháng 1, 4, 7, 10',
      registerUrl: '',
      isPublished: true,
    },
  ]

  for (const prog of studyProgramsToSeed) {
    const exist = await newsRepo.findOne({ where: { slug: prog.slug } })
    if (!exist) {
      await newsRepo.save(newsRepo.create(prog))
      console.log(`✅ Đã seed đơn du học: ${prog.title}`)
    } else {
      console.log(`⏭️  Đơn du học đã tồn tại: ${prog.title}`)
    }
  }

  await AppDataSource.destroy()
}

seed().catch(err => { console.error('❌ Seed thất bại:', err.message); process.exit(1) })
