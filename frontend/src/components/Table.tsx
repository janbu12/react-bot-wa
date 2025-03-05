interface TableColumn<T> {
    key: keyof T;
    label: string;
  }
  
  interface TableProps<T> {
    columns: TableColumn<T>[];
    data: T[];
    actions?: (item: T) => React.ReactNode | null;
  }
  
  export default function Table<T>({ columns, data, actions }: TableProps<T>) {
    return (
      <div className="relative overflow-x-auto shadow sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-900">
          <thead className="text-xs uppercase drop-shadow bg-white">
            <tr>
              {columns.map((col) => (
                <th key={col.key as string} className="px-6 py-3">
                  {col.label}
                </th>
              ))}
              {actions && <th className="px-6 py-3">Aksi</th>}
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index} className="bg-white border-b border-gray-200">
                {columns.map((col) => (
                  <td key={col.key as string} className="px-6 py-4">
                    {item[col.key] as React.ReactNode}
                  </td>
                ))}
                {actions && (
                  <td className="px-6 py-4">
                    {actions(item) || null}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
  