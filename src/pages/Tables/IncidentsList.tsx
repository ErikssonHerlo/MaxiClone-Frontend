import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const IncidentsList = () => {
  const columns = [
    { label: 'Incident ID', renderCell: (item) => item.incidentId },
    { label: 'Shipment ID', renderCell: (item) => item.shipmentId },
    { label: 'Store ID', renderCell: (item) => item.storeId },
    { label: 'User ID', renderCell: (item) => item.userEmail },
    { label: 'Status', renderCell: (item) => item.status },
    { label: 'Solution', renderCell: (item) => item.solution },
  ];
  const storeIds = localStorage.getItem('StoreIds');
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Incidencias" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint={
            storeIds ? `http://35.237.124.228/api/v1/incidents?storeId=${storeIds}` : `http://35.237.124.228/api/v1/incidents`
          }
          columns={columns}
          module="incident-creation"
          urlKey="incidentId"
          filters='sort=incidentId,desc'
        />
      </div>
    </DefaultLayout>
  );
};

export default IncidentsList;
