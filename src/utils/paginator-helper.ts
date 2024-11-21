import {
  FindOptionsOrder,
  FindOptionsRelationByString,
  FindOptionsRelations,
  FindOptionsSelect,
  FindOptionsSelectByString,
  FindOptionsWhere,
  ILike,
  Repository,
} from 'typeorm';

interface HasCreatedAt {
  createdAt: Date;
}

export default class PaginatorHelper {
  static async paginate<T extends HasCreatedAt>(
    repository: Repository<T>,
    dataFieldName: string,
    pageNumber: number,
    take?: number,
    select?: FindOptionsSelect<T> | FindOptionsSelectByString<T>,
    relations?: FindOptionsRelations<T> | FindOptionsRelationByString,
    searchField?: keyof T,
    searchValue?: string | number,
  ) {
    //  where condition for search
    const whereCondition: FindOptionsWhere<T> | FindOptionsWhere<T>[] =
      searchField && searchValue
        ? ({ [searchField]: ILike(`%${searchValue}%`) } as FindOptionsWhere<T>)
        : {};

    const [data, total] = await repository.findAndCount({
      select,
      where: whereCondition,
      take: take || 10,
      skip: (pageNumber - 1) * (take || 10),
      relations,
      order: {
        createdAt: 'DESC',
      } as FindOptionsOrder<T>,
    });

    const total_pages = Math.ceil(total / (take || 10));
    const statistics = {
      total,
      current_page: Number(pageNumber),
      hasNextPage: Number(pageNumber) < total_pages,
      total_pages,
    };

    return {
      [dataFieldName]: data,
      ...statistics,
    };
  }
}
