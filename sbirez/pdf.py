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

def render_proposal_header(proposal, story, style):
    p = Paragraph('Proposal Number: %s' % proposal.proposal_number,
                  style)
    story.append(p)
    p = Paragraph('Date Submitted: %s' % proposal.date_submitted,
                  style)
    story.append(p)
    p = Paragraph(str(proposal.topic.solicitation),
                  style)
    story.append(p)

def render_agency_info(proposal, story, style):
    story.append(Paragraph('Agency Information', style))
    story.append(Paragraph('Agency Name: %s' % proposal.topic.agency, style))
    story.append(Paragraph('Command: %s' % '', style)) # TODO
    story.append(Paragraph('Topic Number: %s' % proposal.topic.topic_number, style))
    story.append(Paragraph('Proposal Title: %s' % proposal.title, style))

def render_firm_info(proposal, story, style):
    story.append(Paragraph('Firm Information', style))
    story.append(Paragraph('Firm Name: %s' % proposal.firm.name, style))
    story.append(Paragraph('Mail Address: %s' % proposal.firm.address, style))
    story.append(Paragraph('Website Address: %s' % proposal.firm.website, style))
    story.append(Paragraph('DUNS: %s' % proposal.firm.duns_id, style))
    story.append(Paragraph('CAGE: %s' % proposal.firm.cage_code, style))
    story.append(Paragraph('SBA SBC Identification Number: %s' %
        proposal.firm.sbc_id, style))

def render_workflow(proposal, story, style):
    # For the moment, tolerate data whether or not
    # it is nested under the name of the workflow
    data = proposal.data.get(proposal.workflow.name) or proposal.data
    for (el, data) in proposal.workflow.bound(data):
        story.append(Paragraph(el.human_plain, style))
        if (not isinstance(data, list) and not isinstance(data, dict)):
            story.append(Paragraph(str(data), style))

def proposal_pdf(proposal, output_file):
    buffer = BytesIO()
    doc = SimpleDocTemplate(buffer)
    story = [Spacer(1,2*inch)]
    style = styles["Normal"]
    render_proposal_header(proposal, story, style)
    render_agency_info(proposal, story, style)
    render_firm_info(proposal, story, style)
    render_workflow(proposal, story, style)
    doc.build(story, onFirstPage=myLaterPages,
              onLaterPages=myLaterPages)

    merger = PdfFileMerger()
    coverfile = open('sbirez/static/coverpage.pdf', 'rb')
    merger.append(coverfile)
    merger.append(buffer)
    merger.write(output_file)
    coverfile.close()
