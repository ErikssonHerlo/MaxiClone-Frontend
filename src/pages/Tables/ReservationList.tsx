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
  const storeIds = localStorage.getItem('StoreIds');
  const rol = localStorage.getItem('Role');
  const filter = (rol === 'WAREHOUSE' ? "status=REQUESTED"+"&sort=id,desc":(rol === 'SUPERVISOR'?"status=PENDING"+"&sort=id,desc":null+"&sort=id,desc"));
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Ordenes" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint={
            storeIds
              ? `http://35.237.124.228/api/v1/orders?storeId=${storeIds}`
              : `http://35.237.124.228/api/v1/orders`
          }
          columns={columns}
          module="create-order"
          urlKey="id"
          filters={filter}
        />
      </div>
    </DefaultLayout>
  );
};

export default OrderList;
