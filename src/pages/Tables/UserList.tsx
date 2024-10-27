import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import TableCustom from '../../components/Tables/TableCustom';
import DefaultLayout from '../../layout/DefaultLayout';

const UserList = () => {
  const columns = [
    { label: 'Username', renderCell: (item) => item.username },
    { label: 'Full Name', renderCell: (item) => item.full_name },
    { label: 'Career Code', renderCell: (item) => item.career_code },
    { label: 'Role', renderCell: (item) => item.role },
    { label: 'Date of Birth', renderCell: (item) => new Date(item.dob).toLocaleDateString() },
    { label: 'Created At', renderCell: (item) => new Date(item.createdAt).toLocaleDateString() },
    { label: 'Updated At', renderCell: (item) => new Date(item.updatedAt).toLocaleDateString() },
  ];

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Listado de Usuarios" />
      <div className="flex flex-col gap-10">
        <TableCustom
          endpoint="http://18.226.172.184:8080/api/v1/user"
          columns={columns}
          module="user-creation"
          urlKey='username'
        />
      </div>
    </DefaultLayout>
  );
};

export default UserList;
