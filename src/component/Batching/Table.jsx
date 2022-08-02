import axios from 'axios';
import { matchSorter } from 'match-sorter';
import React, { useEffect, useMemo, useState } from 'react';
import { useFilters, useSortBy, useTable } from 'react-table';

const tableColumn = [
    {
        Header: "Patient",
        accessor: 'id',
        filter: 'fuzzyText',
    },
    {
        Header: "Billing Provider",
        accessor: 'title'
    },
    {
        Header: "Treating Therapy",
        accessor: 'price'
    },
    {
        Header: "Insurance",
        accessor: 'discountPercentage'
    },
    {
        Header: "Service",
        accessor: 'brand'
    },
    {
        Header: "DOS",
        accessor: 'category',
        disableFilters: true
    },
    {
        Header: "CPT",
        accessor: 'rating'
    },
    {
        Header: "POS",
        accessor: 'description',
        Cell: ({row}) => { return row.values.description.slice(1, 20) + '...'  },
        disableFilters: true
    },
    {
        Header: "M1",
        accessor: 'stock',
        disableFilters: true
    },
    {
        Header: "m2",
        accessor: 'a',
        Cell: ({row}) =>  row.values.description = 'Purple',
        disableFilters: true
    },
    {
        Header: "m3",
        accessor: 'b',
        Cell: ({row}) =>  row.values.description = 'Venezuela',
        disableFilters: true
    } ,
    {
        Header: "M4",
        accessor: 'c',
        Cell: ({row}) =>  row.values.description = 'Meghann Durtnal',
        disableFilters: true
    },
    {
        Header: "Amount",
        accessor: 'd',
        Cell: ({row}) =>  row.values.description = '$5000',
        disableFilters: true
    },
    {
        Header: "Units",
        accessor: 'e',
        Cell: ({row}) =>  row.values.description = '4',
        disableFilters: true
    },
    {
        Header: "Status",
        accessor: 'f',
        Cell: ({row}) =>  row.values.description = 'Active',
        disableFilters: true
    }
];

//custom search field for headers
function DefaultColumnFilter({
    column: { filterValue, preFilteredRows, setFilter },
  }) {
    // const count = preFilteredRows.length
  
    return (
      <input
        value={filterValue || ''}
        className='input input-xs input-bordered mx-1 w-full rounded-sm'
        onChange={e => {
          setFilter(e.target.value || undefined)
        }}
        placeholder="Search"
      />
    )
};

function fuzzyTextFilterFn(rows, id, filterValue) {
    return matchSorter(rows, filterValue, { keys: [row => row.values[id]] })
}

const Table = () => {
    const [info, setInfo] = useState([]);

    const columns = useMemo(()=>tableColumn, []);
    const data = useMemo(()=>info, [info]);
    const defaultColumn = useMemo(() => ({ Filter: DefaultColumnFilter }), []);
    const filterTypes = React.useMemo(
        () => ({
        // Add a new fuzzyTextFilterFn filter type.
        fuzzyText: fuzzyTextFilterFn,
        // Or, override the default text filter to use
        // "startWith"
        text: (rows, id, filterValue) => {
            return rows.filter(row => {
            const rowValue = row.values[id]
            return rowValue !== undefined
                ? String(rowValue)
                    .toLowerCase()
                    .startsWith(String(filterValue).toLowerCase())
                : true
            })
        },
        }),
        []
    )

    useEffect(() => {
        (async function(){
            try {
                const {data: { smartphones: products }} = await axios.get('https://run.mocky.io/v3/4a8b3706-4c59-494a-a457-c91ec6914b93?fbclid=IwAR1mOVHF-Zu2jzqxOrkJitBZ8-Zz6aQuK7wYMoYGTe907ND2lrSe7qn2gOg');

                setInfo(products);
            } catch (error) {
                console.log(error);
            }
        })()
    }, []);

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns,
        data,
        defaultColumn,
        filterTypes,
    }, useFilters, useSortBy);

    if(data.length === 0){
        return <h1 className='text-center font-semibold mt-5'>Loading....</h1>
    }

    return (
        <>
            <div className="overflow-x-auto my-5 shadow-lg">
                <table {...getTableProps()}  className="table table-compact w-full">
                    <thead>
                        {headerGroups.map(headerGroup => (
                            <tr {...headerGroup.getHeaderGroupProps()}>
                                {headerGroup.headers.map(column => (
                                    <th>
                                        <span {...column.getHeaderProps(column.getSortByToggleProps())} className='flex items-center justify-center gap-1 pb-1'>
                                            <span className='text-xs'>{column.render('Header')}</span>
                                            {column.isSorted
                                            ? column.isSortedDesc
                                                ? <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                </svg>
                                                : <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline" viewBox="0 0 20 20" fill="currentColor">
                                                    <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                                                </svg>
                                            : ''}
                                        </span>
                                        {/* Render the columns filter UI */}
                                        <div>{column.canFilter ? column.render('Filter') : null}</div>
                                    </th>
                                ))}
                            </tr>
                        ))}
                    </thead>
                    <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map(cell => (
                                    cell.column.id === 'id' ? <th {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                </th> : <td {...cell.getCellProps()}>
                                    {cell.render('Cell')}
                                </td>
                                ))}
                        </tr>
                        )
                    })}
                    </tbody>
                </table>
            </div>
        </>
    );
};

export default Table;