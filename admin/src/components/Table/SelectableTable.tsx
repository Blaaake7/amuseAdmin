import React, {useEffect} from 'react';
import {usePagination, useRowSelect, useTable} from 'react-table';
import './table.module.css';
import {useNavigate} from 'react-router-dom';


// @ts-ignore
const SelectableTable = ({route = '', columns, data, pageCount = 1}) => {
	const navigate = useNavigate();
	
	const onClickRow = (id: number) => {
		if (route !== '') navigate(`/${route}/${id}`);
	};
	
	
	const {
		getTableProps,
		getTableBodyProps,
		headerGroups,
		page,
		nextPage,
		previousPage,
		canNextPage,
		canPreviousPage,
		pageOptions,
		gotoPage,
		setPageSize,
		state,
		prepareRow,
	} = useTable(
		{
			columns,
			data,
		},
		usePagination,
		useRowSelect,
		(hooks) => {
			hooks.visibleColumns.push((columns) => [
				{
					id: '선택',
					Header: '선택',
					Cell: ({row}) => (
						// <input type="checkbox" {...row.getToggleRowSelectedProps()} />
                        <input type="checkbox"/>
					),
				},
				...columns,
			]);
		}
	);
	
	const {pageIndex, pageSize} = state;
	
	
	return (
		<div style={{marginLeft: '5%', width: '90%'}}>
			<div className="table">
				<table {...getTableProps()}>
					<thead>
					{headerGroups.map((headerGroup) => (
						<tr {...headerGroup.getHeaderGroupProps()}>
							{headerGroup.headers.map((column) => (
								<th {...column.getHeaderProps()}>{column.render('Header')}</th>
							))}
						</tr>
					))}
					</thead>
					
					<tbody {...getTableBodyProps()}>
					{page.map((row: any) => {
						prepareRow(row);
						return (
							<tr {...row.getRowProps()} onClick={() => onClickRow(row.original.id)}>
								{row.cells.map((cell: any) => {
									return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>;
								})}
							</tr>
						);
					})}
					</tbody>
				</table>
				
				<div
					className="table-pagination"
					style={{margin: '5px', display: 'flex', justifyContent: 'center', alignItems: 'center'}}
				>
					<button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>
						{'<<'}
					</button>
					<button onClick={() => previousPage()} disabled={!canPreviousPage}>
						Previous
					</button>
					<span>
            <strong style={{display: 'block', width: '100px', textAlign: 'center'}}>
              {pageIndex + 1} / {pageOptions.length}
            </strong>
          </span>
					<button onClick={() => nextPage()} disabled={!canNextPage}>
						Next
					</button>
					<button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>
						{'>>'}
					</button>
				</div>
				<div
					className="table-pagesize"
					style={{margin: '5px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center'}}
				>
					<select value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))}>
						{[10, 25, 50].map((pageSize) => (
							<option key={pageSize} value={pageSize}>
								{pageSize}개 씩 보기
							</option>
						))}
					</select>
				</div>
			</div>
		</div>
	);
};

export default SelectableTable;