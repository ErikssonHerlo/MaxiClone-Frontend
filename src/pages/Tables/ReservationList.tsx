import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const ReservationList = () => {
  const columns = [
    { label: 'ID', renderCell: (item) => item.id },
    { label: 'Username', renderCell: (item) => item.username },
    { label: 'ISBN Code', renderCell: (item) => item.isbn_code },
    {
      label: 'Reservation Date',
      renderCell: (item) =>
        new Date(item.reservation_date).toLocaleDateString(),
    },
    { label: 'Status', renderCell: (item) => item.status },
    {
      label: 'Created At',
      renderCell: (item) => new Date(item.created_at).toLocaleDateString(),
    },
    {
      label: 'Updated At',
      renderCell: (item) => new Date(item.updated_at).toLocaleDateString(),
    },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Reservaciones" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint="http://18.226.172.184:8080/api/v1/reservation"
          columns={columns}
          module="reservation-creation"
          urlKey="id"
        />
      </div>
    </DefaultLayout>
  );
};

export default ReservationList;
