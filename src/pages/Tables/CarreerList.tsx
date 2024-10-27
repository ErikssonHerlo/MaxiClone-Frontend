import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const CarreerList = () => {
  const columns = [
    { label: 'Code', renderCell: (item) => item.code },
    { label: 'Name', renderCell: (item) => item.name },
    {
      label: 'Created At',
      renderCell: (item) => new Date(item.createdAt).toLocaleDateString(),
    },
    {
      label: 'Updated At',
      renderCell: (item) => new Date(item.updatedAt).toLocaleDateString(),
    },
  ];
  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Carreras" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint="http://18.226.172.184:8080/api/v1/career"
          columns={columns}
          module="carreer-creation"
          urlKey='code'
        />
      </div>
    </DefaultLayout>
  );
};

export default CarreerList;
