import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const ShipmentsList = () => {
  const columns = [
    { label: 'ID', renderCell: (item) => item.id },
    { label: 'Order ID', renderCell: (item) => item.orderId },
    { label: 'Store ID', renderCell: (item) => item.storeId },
    { label: 'User ID', renderCell: (item) => item.userId },
    { label: 'Departure Date', renderCell: (item) => item.departureDate },
    { label: 'Reception Date', renderCell: (item) => item.receptionDate },
    { label: 'Total Shipment', renderCell: (item) => item.totalShipment },
    { label: 'Status', renderCell: (item) => item.shipmentStatus },
  ];
  const storeIds = localStorage.getItem('StoreIds');
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Envios" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint={
            storeIds ? `http://35.237.124.228/api/v1/shipments?storeId=${storeIds}` : `http://35.237.124.228/api/v1/shipments`
          }
          columns={columns}
          module="shipment-creation"
          urlKey="id"
        />
      </div>
    </DefaultLayout>
  );
};

export default ShipmentsList;
