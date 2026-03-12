import * as XLSX from "xlsx"

export const exportTableToExcel = (title, columns, rows, filename) => {
  const worksheetData = [
    [title],
    [],
    columns,
    ...rows
  ]

  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData)

  const workbook = XLSX.utils.book_new()

  XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")

  XLSX.writeFile(workbook, filename)
}