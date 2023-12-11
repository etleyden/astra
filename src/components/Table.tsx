
import {FC} from 'react'; //React library for componetnt
import "./Table.css"; //CSS for component


/**
 *  The Table component can accept a JSON object:
 *  The JSON object should follow: {"cols": [], "rows": [[],[],[]]}
 *  where each row matches all of the headings. 
 * */
interface TableProps {
	data: {
		cols: Array<string>;
		rows: Array<any>;
	}
}
export const Table: FC<TableProps> = ({data}) => {

    //For each item in col, make a new table heading:

	var column_headings = (
		<tr className="astra_table_heading">
		{data.cols.map((heading, idx) => (<th className="astra_table_heading_cell" key={idx}>{heading}</th>))}
		</tr>);

	var row_data =
	data.rows.map((row: Array<any>, idx: number) => (
		<tr className="astra_table_row" key={idx}>
		{row.map((item: any, idx: number) => (<td className="astra_table_cell" key={idx}>{item}</td>))}
		</tr>
		));


	console.log(column_headings);

	return (
		<table className="astra_table">
			<tbody className="astra_table_body">
				{column_headings}
				{row_data}
			</tbody>
		</table>
	);

}

export default Table;
