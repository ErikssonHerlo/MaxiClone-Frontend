import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const OrderList = () => {
  const columns = [
    { label: 'ID', renderCell: (item) => item.id },
    { label: 'Store ID', renderCell: (item) => item.storeId },
    { label: 'User ID', renderCell: (item) => item.userId },
    { label: 'Total Order', renderCell: (item) => item.totalOrder },
    { label: 'Status', renderCell: (item) => item.orderStatus },
    { label: 'Rejection Reason', renderCell: (item) => item.rejectionReason },
  ];
  const storeId = localStorage.getItem('StoreId');
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Ordenes" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint={storeId ? `http://35.237.124.228/api/v1/orders?storeId=${storeId}` : `http://35.237.124.228/api/v1/orders`}
          columns={columns}
          module="create-order"
          urlKey="id"
        />
      </div>
    </DefaultLayout>
  );
};

export default OrderList;
