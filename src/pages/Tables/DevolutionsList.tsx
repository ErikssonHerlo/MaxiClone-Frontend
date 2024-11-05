import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const DevolutionsList = () => {
  const columns = [
    { label: 'Devolution ID', renderCell: (item) => item.devolutionId },
    { label: 'Shipment ID', renderCell: (item) => item.shipmentId },
    { label: 'Store ID', renderCell: (item) => item.storeId },
    { label: 'User ID', renderCell: (item) => item.userEmail },
    { label: 'Status', renderCell: (item) => item.status },
    { label: 'CreatedAt', renderCell: (item) => item.createdAt },
  ];
  const storeIds = localStorage.getItem('StoreIds');
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Devoluciones" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint={
            storeIds ? `http://35.237.124.228/api/v1/devolutions?storeId=${storeIds}` : `http://35.237.124.228/api/v1/devolutions`
          }
          columns={columns}
          module="devolution-creation"
          urlKey="devolutionId"
          filters='sort=devolutionId,desc'
        />
      </div>
    </DefaultLayout>
  );
};

export default DevolutionsList;
