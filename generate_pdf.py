from fpdf import FPDF

pdf = FPDF()
pdf.add_page()
pdf.set_font("Arial", size=12)
pdf.cell(200, 10, txt="AGREEMENT FOR PERSONAL POWER LOAN", ln=1, align="C")
pdf.cell(200, 10, txt="1. Define this agreement.", ln=1)
pdf.multi_cell(0, 10, txt="In case when the Borrower is one or more individual(s)... they are jointly and severally liable.")
pdf.output("input-pdfs/test_loan.pdf")
print("Created input-pdfs/test_loan.pdf")
