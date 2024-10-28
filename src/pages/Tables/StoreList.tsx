import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import StoreTable from '../../components/Tables/StoreTable';
import DefaultLayout from '../../layout/DefaultLayout';

const Stores = () => {
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Tiendas" />
      <div className="flex flex-col gap-10">
        <StoreTable
          endpoint="http://35.237.124.228/api/v1/stores"
          module="store-creation"
          urlKey="id"
        />
      </div>
    </DefaultLayout>
  );
};

export default Stores;
