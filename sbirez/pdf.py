from html import escape
from io import BytesIO
from PyPDF2 import PdfFileMerger
from reportlab.pdfgen import canvas
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.rl_config import defaultPageSize
from reportlab.lib.units import inch
PAGE_HEIGHT=defaultPageSize[1]; PAGE_WIDTH=defaultPageSize[0]
styles = getSampleStyleSheet()

Title = "Hello world"
pageinfo = "platypus example"
def myFirstPage(canvas, doc):
    canvas.saveState()
    canvas.setFont('Times-Bold',16)
    canvas.drawCentredString(PAGE_WIDTH/2.0, PAGE_HEIGHT-108, Title)
    canvas.setFont('Times-Roman',9)
    canvas.drawString(inch, 0.75 * inch, "First Page / %s" % pageinfo)
    canvas.restoreState()

def myLaterPages(canvas, doc):
    canvas.saveState()
    canvas.setFont('Times-Roman',9)
    canvas.drawString(inch, 0.75 * inch, "Page %d %s" % (doc.page, pageinfo))
    canvas.restoreState()

def render_element(proposal, element, story, style):
    # import ipdb; ipdb.set_trace()
    # if element.element_type not in ('workflow', 'group')
    p = Paragraph(escape(element.human or element.name),
                  style)
    story.append(p)
    story.append(Spacer(1,0.2*inch))
    for child in element.children.all(): # order?
        render_element(proposal, child, story, style)

def proposal_pdf(proposal, output_file):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    story = [Spacer(1,2*inch)]
    style = styles["Normal"]
    render_element(proposal, proposal.workflow, story, style)

    doc.build(story, onFirstPage=myLaterPages,
              onLaterPages=myLaterPages)

    merger = PdfFileMerger()
    coverfile = open('sbirez/static/coverpage.pdf', 'rb')
    merger.append(coverfile)
    merger.append(buffer)
    merger.write(output_file)
    coverfile.close()
