import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const UserList = () => {
  const columns = [
    { label: 'Email', renderCell: (item) => item.email },
    { label: 'First Name', renderCell: (item) => item.firstName },
    { label: 'Last Name', renderCell: (item) => item.lastName },
    { label: 'Role', renderCell: (item) => item.role },
    { label: 'Created At', renderCell: (item) => new Date(item.createdAt).toLocaleDateString() },
    { label: 'Updated At', renderCell: (item) => new Date(item.updatedAt).toLocaleDateString() },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Usuarios" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint="http://35.237.124.228/api/v1/users"
          columns={columns}
          module="user-creation"
          urlKey='email'
        />
      </div>
    </DefaultLayout>
  );
};

export default UserList;
