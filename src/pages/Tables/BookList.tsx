import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import BookTable from '../../components/Tables/BookTable';
import DefaultLayout from '../../layout/DefaultLayout';

const Books = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Catalogo" />
      <div className="flex flex-col gap-10">
        <BookTable
          endpoint="http://35.237.124.228/api/v1/catalog/products"
          module="book-creation"
          urlKey="sku"
        />
      </div>
    </DefaultLayout>
  );
};

export default Books;
