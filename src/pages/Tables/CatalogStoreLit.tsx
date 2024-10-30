import { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import BookTable from '../../components/Tables/BookTable';
import DefaultLayout from '../../layout/DefaultLayout';
import { useNavigate } from 'react-router-dom';
import CatalogStoreTable from '../../components/Tables/CatalogStoreTable';

const CatalogStore = () => {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Catalogo de Tienda" />
      <div className="flex flex-col gap-10">
      <CatalogStoreTable
        endpoint={`http://35.237.124.228/api/v1/catalog/products/store/`}
        module="book-creation"
        urlKey="sku"
    />

      </div>
    </DefaultLayout>
  );
};

export default CatalogStore;
