import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export const exportTableToPdf = async (title, columns, rows, fileName) => {

  const doc = new jsPDF()

  const logo = new Image()
  logo.src = "/psfm-logo.png"

  const now = new Date()
  const formattedDate = now.toLocaleDateString()
  const formattedTime = now.toLocaleTimeString()

  logo.onload = () => {

    /* LOGO */

    doc.addImage(logo, "PNG", 14, 8, 28, 28)

    /* TITLE */

    doc.setFontSize(18)
    doc.text("PSFM Workforce Management", 50, 18)

    doc.setFontSize(12)
    doc.text(title, 50, 26)

    /* DATE */

    doc.setFontSize(10)
    doc.text(
      `Generated: ${formattedDate} ${formattedTime}`,
      14,
      40
    )

    /* TABLE */

    autoTable(doc, {
      head: [columns],
      body: rows,
      startY: 46,
      styles: {
        fontSize: 10
      },
      headStyles: {
        fillColor: [37, 99, 235]
      }
    })

    /* PAGE NUMBERS */

    const pageCount = doc.internal.getNumberOfPages()

    for (let i = 1; i <= pageCount; i++) {

      doc.setPage(i)

      doc.setFontSize(10)

      doc.text(
        `Page ${i} of ${pageCount}`,
        doc.internal.pageSize.getWidth() - 40,
        doc.internal.pageSize.getHeight() - 10
      )
    }

    doc.save(fileName)
  }
}