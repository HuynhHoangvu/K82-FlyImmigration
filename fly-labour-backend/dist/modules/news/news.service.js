"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NewsService = exports.CreateNewsDto = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const news_entity_1 = require("./news.entity");
const class_validator_1 = require("class-validator");
const swagger_1 = require("@nestjs/swagger");
const gcs_service_1 = require("../../common/services/gcs.service");
class CreateNewsDto {
}
exports.CreateNewsDto = CreateNewsDto;
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "title", void 0);
__decorate([
    (0, swagger_1.ApiProperty)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "slug", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "titleEn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "excerpt", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "excerptEn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "content", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "contentEn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "image", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Boolean)
], CreateNewsDto.prototype, "isPublished", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false, enum: ['news', 'handbook', 'study', 'travel'] }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "type", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "country", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "registerUrl", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateNewsDto.prototype, "priceFrom", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Number)
], CreateNewsDto.prototype, "priceTo", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "priceCurrency", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "itinerary", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "itineraryEn", void 0);
__decorate([
    (0, swagger_1.ApiProperty)({ required: false }),
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", String)
], CreateNewsDto.prototype, "studyType", void 0);
async function translateText(text, from = 'vi', to = 'en') {
    if (!text)
        return '';
    try {
        const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${from}&tl=${to}&dt=t&q=${encodeURIComponent(text)}`;
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();
        if (data && data[0]) {
            return data[0].map((item) => item[0]).join('');
        }
    }
    catch (error) {
        console.error('Translation error:', error);
    }
    return text;
}
async function translateHtml(html, from = 'vi', to = 'en') {
    if (!html)
        return '';
    try {
        const parts = html.split(/(<[^>]+>)/g);
        const translatedParts = await Promise.all(parts.map(async (part) => {
            if (part.startsWith('<') && part.endsWith('>')) {
                return part;
            }
            if (part.trim().length === 0) {
                return part;
            }
            return await translateText(part, from, to);
        }));
        return translatedParts.join('');
    }
    catch (error) {
        console.error('HTML translation error:', error);
        return html;
    }
}
let NewsService = class NewsService {
    constructor(newsRepo, gcsService) {
        this.newsRepo = newsRepo;
        this.gcsService = gcsService;
    }
    findAll() {
        return this.newsRepo.find({ where: { isPublished: true, type: 'news' }, order: { createdAt: 'DESC' }, take: 20 });
    }
    findAllHandbook() {
        return this.newsRepo.find({ where: { isPublished: true, type: 'handbook' }, order: { createdAt: 'DESC' }, take: 50 });
    }
    findAllStudy(country, studyType) {
        const where = { isPublished: true, type: 'study' };
        if (country)
            where.country = country;
        if (studyType)
            where.studyType = studyType;
        return this.newsRepo.find({ where, order: { createdAt: 'DESC' }, take: 100 });
    }
    findAllTravel() {
        return this.newsRepo.find({ where: { isPublished: true, type: 'travel' }, order: { createdAt: 'DESC' }, take: 100 });
    }
    findAllAdmin() {
        return this.newsRepo.find({ where: { type: 'news' }, order: { createdAt: 'DESC' } });
    }
    findAllHandbookAdmin() {
        return this.newsRepo.find({ where: { type: 'handbook' }, order: { createdAt: 'DESC' } });
    }
    findAllStudyAdmin() {
        return this.newsRepo.find({ where: { type: 'study' }, order: { createdAt: 'DESC' } });
    }
    findAllTravelAdmin() {
        return this.newsRepo.find({ where: { type: 'travel' }, order: { createdAt: 'DESC' } });
    }
    async findOne(slug) {
        const n = await this.newsRepo.findOne({ where: { slug } });
        if (!n)
            throw new common_1.NotFoundException('Không tìm thấy bài viết');
        return n;
    }
    async create(dto, file) {
        const titleEn = dto.titleEn || (await translateText(dto.title));
        const excerptEn = dto.excerptEn || (dto.excerpt ? await translateText(dto.excerpt) : undefined);
        const contentEn = dto.contentEn || (dto.content ? await translateHtml(dto.content) : undefined);
        const itineraryEn = dto.itineraryEn || (dto.itinerary ? await translateText(dto.itinerary) : undefined);
        const n = this.newsRepo.create({
            ...dto,
            titleEn,
            excerptEn,
            contentEn,
            itineraryEn,
            type: dto.type ?? 'news',
            isPublished: this.parseBoolean(dto.isPublished),
        });
        if (file)
            n.image = await this.saveFile(file, dto.type ?? 'news');
        return this.newsRepo.save(n);
    }
    async update(id, dto, file) {
        const n = await this.newsRepo.findOne({ where: { id } });
        if (!n)
            throw new common_1.NotFoundException();
        let titleEn = dto.titleEn;
        if (dto.title !== undefined && !titleEn) {
            titleEn = await translateText(dto.title);
        }
        let excerptEn = dto.excerptEn;
        if (dto.excerpt !== undefined && !excerptEn) {
            excerptEn = dto.excerpt ? await translateText(dto.excerpt) : '';
        }
        let contentEn = dto.contentEn;
        if (dto.content !== undefined && !contentEn) {
            contentEn = dto.content ? await translateHtml(dto.content) : '';
        }
        let itineraryEn = dto.itineraryEn;
        if (dto.itinerary !== undefined && !itineraryEn) {
            itineraryEn = dto.itinerary ? await translateText(dto.itinerary) : '';
        }
        Object.assign(n, {
            ...dto,
            ...(titleEn !== undefined ? { titleEn } : {}),
            ...(excerptEn !== undefined ? { excerptEn } : {}),
            ...(contentEn !== undefined ? { contentEn } : {}),
            ...(itineraryEn !== undefined ? { itineraryEn } : {}),
            isPublished: dto.isPublished !== undefined ? this.parseBoolean(dto.isPublished) : n.isPublished,
        });
        if (file)
            n.image = await this.saveFile(file, n.type);
        return this.newsRepo.save(n);
    }
    async remove(id) {
        const n = await this.newsRepo.findOne({ where: { id } });
        if (!n)
            throw new common_1.NotFoundException();
        await this.newsRepo.remove(n);
        return { message: 'Đã xóa bài viết' };
    }
    parseBoolean(value) {
        if (typeof value === 'boolean')
            return value;
        if (typeof value === 'string')
            return value === 'true' || value === '1';
        return !!value;
    }
    async saveFile(file, type) {
        const folder = type === 'handbook' ? 'handbook'
            : type === 'study' ? 'study'
                : type === 'travel' ? 'travel'
                    : 'news';
        return this.gcsService.uploadFile(file, folder);
    }
};
exports.NewsService = NewsService;
exports.NewsService = NewsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(news_entity_1.News)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        gcs_service_1.GcsService])
], NewsService);
//# sourceMappingURL=news.service.js.map