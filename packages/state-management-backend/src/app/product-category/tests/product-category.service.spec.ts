import { Test } from '@nestjs/testing';
import { businessStub } from '../../business/tests/business.stubs';
import { BusinessHq } from '../../business/entities/business.entity';
import { BusinessService } from '../../business/services/business.service';
import { EntityRepository } from '@mikro-orm/core';
import { ProductCategory } from '../entities/product-category.entity';
import { ProductCategoryService } from '../services/product-category.service';
import {
  categories,
  categorySearch,
  categoryUpdated,
  getCategoriesResponse,
  singleCategory,
} from './product-category.stub';

describe('ProductCategoryService', () => {
  let productCategoryService: ProductCategoryService;
  let businessService: BusinessService;
  const mockProductCategoryRepository = {
    findAndCount: jest
      .fn()
      .mockResolvedValue([
        getCategoriesResponse.data,
        getCategoriesResponse.data.length,
      ]),
    findOne: jest.fn().mockResolvedValue(singleCategory),
    create: jest.fn().mockReturnValue(singleCategory),
    assign: jest.fn().mockReturnValue(categoryUpdated),
    persistAndFlush: jest.fn().mockReturnValue(true),
  };
  beforeEach(async () => {
    const mockBusinessService = {
      findById: jest
        .fn()
        .mockImplementation(() => Promise.resolve(businessStub as BusinessHq)),
    };
    const moduleRef = await Test.createTestingModule({
      providers: [
        ProductCategoryService,
        {
          provide: BusinessService,
          useValue: mockBusinessService,
        },
        {
          provide: 'ProductCategoryRepository',
          useValue: mockProductCategoryRepository,
        },
      ],
    }).compile();

    productCategoryService = moduleRef.get<ProductCategoryService>(
      ProductCategoryService
    );
    businessService = moduleRef.get<BusinessService>(BusinessService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Get all categories', () => {
    it('Should return all categories', async () => {
      const userId = '1';
      const business = jest.spyOn(businessService, 'findById');
      const findAndAccount = jest.spyOn(
        mockProductCategoryRepository,
        'findAndCount'
      );
      const categoriesResponse = await productCategoryService.getAll(
        { page: 1, limit: 10 },
        userId
      );
      expect(business).toBeCalledWith(userId);
      expect(findAndAccount).toBeCalled();
      expect(categoriesResponse).toEqual(getCategoriesResponse);
    });
  });

  describe('Get category by id', () => {
    it('should return category by id', async () => {
      const categoryId = '1';
      const category = await productCategoryService.getById(categoryId);
      expect(category).toEqual(singleCategory);
    });
  });

  describe('search a category by name', () => {
    it('should return a category by name', async () => {
      const name = 'Category';
      const userId = '1';
      const business = jest.spyOn(businessService, 'findById');
      const findAndAccount = jest
        .spyOn(mockProductCategoryRepository, 'findAndCount')
        .mockResolvedValue([categorySearch.data, categorySearch.data.length]);
      const category = await productCategoryService.search(
        { page: 1, limit: 10 },
        '1',
        name
      );
      expect(business).toBeCalledWith(userId);
      expect(findAndAccount).toBeCalled();
      expect(category).toEqual(categorySearch);
    });
  });

  describe('Create a category', () => {
    it('should create a category', async () => {
      const categoryDto = {
        name: 'Category 2',
        description: 'Category 1 description',
      };
      const newCategory = {
        categoryId: '1',
        ...categoryDto,
      };
      const businessId = '1';
      const business = jest.spyOn(businessService, 'findById');
      const create = jest.spyOn(mockProductCategoryRepository, 'create');
      const persistAndFlush = jest.spyOn(
        mockProductCategoryRepository,
        'persistAndFlush'
      );
      const category = await productCategoryService.create('1', categoryDto);
      expect(business).toBeCalledWith(businessId);
      expect(create).toBeCalled();
      expect(persistAndFlush).toBeCalled();
      expect(category).toEqual(newCategory);
    });
  });

  describe('Update a category', () => {
    it('should update a category', async () => {
      const categoryId = '1';
      const categoryDto = {
        name: 'Category 1',
        description: 'Description updated',
      };
      jest
        .spyOn(mockProductCategoryRepository, 'findOne')
        .mockResolvedValue(categoryUpdated);
      const newCategory = jest.spyOn(mockProductCategoryRepository, 'assign');
      const persistAndFlush = jest.spyOn(
        mockProductCategoryRepository,
        'persistAndFlush'
      );
      const category = await productCategoryService.update(
        categoryId,
        categoryDto
      );
      expect(newCategory).toBeCalled();
      expect(persistAndFlush).toBeCalled();
      expect(category).toEqual(categoryUpdated);
    });
  });

  describe('Delete a category', () => {
    it('should delete a category', async () => {
      const categoryId = '1';
      const findCategory = jest.spyOn(mockProductCategoryRepository, 'findOne');
      const softDelete = jest.spyOn(
        mockProductCategoryRepository,
        'persistAndFlush'
      );
      await productCategoryService.delete(categoryId);
      expect(findCategory).toBeCalled();
      expect(softDelete).toBeCalled();
    });
  });
});
