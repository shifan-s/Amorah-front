import PropTypes from 'prop-types';

function AdminTable({ columns, children }) {
  return (
    <div className="overflow-x-auto border border-[#DED2C5] bg-[#FFFDF8]">
      <table className="min-w-[920px] w-full text-left text-sm">
        <thead className="bg-[#F3ECE3] text-xs uppercase tracking-[0.12em] text-[#6F6259]">
          <tr>
            {columns.map((column) => (
              <th key={column} scope="col" className="px-4 py-3 font-semibold">
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-[#DED2C5]">{children}</tbody>
      </table>
    </div>
  );
}

AdminTable.propTypes = {
  columns: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default AdminTable;
