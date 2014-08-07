'use strict';

exports.getProposalList = function(req, res) {
  req.db.all("SELECT id, name, description FROM proposals WHERE userid = ?1", req.user.id, function (err, rows) {
    //console.log('length: ' + rows.length);
    var listing = { 'proposals':[] };
    for (var i = 0; i < rows.length; i++) {
      //console.log(rows[i]);
      var proposal = {};
      proposal.id = rows[i].id;
      proposal.name = rows[i].name;
      proposal.description = rows[i].description;
      listing.proposals.push(proposal);
    }
    res.json(listing);
  });
};

exports.getKeywords = function(req, res) {
  res.json({
    "keywords" : [
      "resume", "proposal", "form"
    ]});
};

exports.addKeyword = function(req, res) {
  console.log('Keyword added');
};

exports.formsList = function(req, res) {
  res.json([
    {
      "id": "1",
      "name": "DoD SBIR Organization Application",
      "description": "Application for an organization to allow them to submit a SBIR proposal for the DoD."
    },
    {
      "id": "2",
      "name": "SBIR Organization Application",
      "description": "Application for an organization to allow them to submit a proposal for a non-DoD SBIR."
    }
  ]);
};

exports.forms = function(req, res) {
  console.log('Form ID:' + req.params.id + ' User ID:' + req.user.id);
  var jsonData = {}; 
  if (req.params.id === '1') {
    jsonData = {
      "type": "object",
      "properties": {
        "companyinfo": {
          "type": "object",
          "title": "Company Information",
          "properties": {
            "companyname": {
              "type": "string",
              "title": "Firm Name"
            },
            "address1": {
              "type": "string",
              "title": "Address 1"
            },
            "address2": {
              "type": "string",
              "title": "Address 2"
            },
            "state": {
              "type": "string",
              "title": "State"
            },
            "zipcode": {
              "type": "string",
              "title": "ZIP Code"
            },
            "taxid": {
              "type": "string",
              "title": "Federal Tax ID or Social Security Number"
            },
            "sbcid": {
              "type": "string",
              "title": "SBA SBC ID"
            },
            "duns": {
              "type": "string",
              "title": "DUNS"
            },
            "cagecode": {
              "type": "string",
              "title": "CAGE Code"
            },
            "siccodes": {
              "type": "string",
              "title": "SIC Codes"
            },
            "naics": {
              "type": "string",
              "title": "NAICS"
            }
          }
        },
        "contactinfo": {
          "type": "object",
          "title": "Contact Information",
          "properties": {
            "firstname": {
              "type": "string",
              "title": "Name"
            },
            "phone": {
              "type": "string",
              "title": "Phone Number"
            },
            "email": {
              "type": "string",
              "title": "Email"
            },
            "website": {
                "type": "string",
                "title": "Company Website"
            }
          }
        },
        "companybackground": {
          "type": "object",
          "title": "Company Background",
          "properties": {
            "yearfounded": {
              "type": "string",
              "title": "The year your company was founded"
            },
            "phase1count": {
                "type": "string",
                "title": "How many Phase 1 SBIR/STTR awards have your firm received?"
            },
            "phase1year": {
                "type": "string",
                "title": "What year did you receive your first Phase 1 award?"
            },
            "phase2count": {
                "type": "string",
                "title": "How many Phase 2 SBIR/STTR awards have your firm received?"
            },
            "phase2year": {
                "type": "string",
                "title": "What year did you receive your first Phase 2 award?"
            },
            "numberofemployeesatp2": {
                "type": "string",
                "title": "Number of Employees at first Phase 2 award"
            },
            "numberofemployees": {
                "type": "string",
                "title": "Current Number of Employees"
            },
            "ipo": {
              "type": "string",
              "title": "Has your firm successfully completed an Initial Public Offering (IPO) of stock since receiving its first Phase II award that was the result, in part, of technology your firm developed under the Federal SBIR and/or STTR programs?",
              "enum": [
                "Yes",
                "No"
              ]
            },
            "patents": {
              "type": "string",
              "title": "How many patents have resulted, at least in part, from your firm's SBIR and/or STTR awards?"
            },
            "totalrevenue": {
              "type": "string",
              "title": "Your firm's total revenue for the last fiscal year",
              "enum": [
                  "<$100,000",
                  "$100,000-$499,999", 
                  "$500,000-$999,999",
                  "$1,000,000-$4,999,999",
                  "$5,000,000-$19,999,999",
                  "$20,000,000-$99,999,999",
                  "$100,000,000+"
              ]
            },
            "percentrevenue": {
                "type": "string",
                "title": "What percentage of your firm's revenues during its last fiscal year is Federal SBIR and/or STTR funding (Phase I and/or Phase II)?"
            }
          }
        }
      }
    }; 
  }
  else if (req.params.id === '2') {
    jsonData = {
      "type": "object",
      "properties": {
        "companyinfo": {
          "type": "object",
          "title": "Company Information",
          "properties": {
            "companyname": {
              "type": "string",
              "title": "Company Name"
            },
            "address1": {
              "type": "string",
              "title": "Address 1"
            },
            "address2": {
              "type": "string",
              "title": "Address 2"
            },
            "state": {
              "type": "string",
              "title": "State"
            },
            "zipcode": {
              "type": "string",
              "title": "ZIP Code"
            },
            "website": {
              "type": "string",
              "title": "Company Website"
            },
            "duns": {
              "type": "string",
              "title": "DUNS"
            },
            "ein": {
              "type": "string",
              "title": "EIN"
            }
          }
        },
        "ownershipinfo": {
          "type": "object",
          "title": "Ownership Information",
          "properties": {
            "ownedbyvcs": {
              "type": "string",
              "title": "Is the SBC majority-owned by multiple venture capital operating companies, hedge funds or private equity firms?",
              "enum": [
                "Yes",
                "No"
              ]
            },
            "percentvc": {
                "type": "string",
                "title": "What percentage (%) of the SBC is majority-owned by multiple venture capital operating companies, hedge funds or private equity firms?"
            },
            "numberofemployees": {
                "type": "string",
                "title": "Number of Employees"
            },
            "womenowned": {
              "type": "string",
              "title": "Woman-Owned",
              "enum": [
                "Yes",
                "No"
              ]
            },
            "minorityowned": {
              "type": "string",
              "title": "Minority-Owned",
              "enum": [
                "Yes",
                "No"
              ]
            },
            "hubzoneowned": {
              "type": "string",
              "title": "HUBZone-Owned",
              "enum": [
                "Yes",
                "No"
              ]
            }
          }
        },
        "contactinfo": {
          "type": "object",
          "title": "Contact Information",
          "properties": {
            "firstname": {
              "type": "string",
              "title": "First Name"
            },
            "middleinitial": {
              "type": "string",
              "title": "Middle Initial"
            },
            "lastname": {
              "type": "string",
              "title": "Last Name"
            },
            "suffix": {
              "type": "string",
              "title": "Suffix"
            },
            "contacttitle": {
              "type": "string",
              "title": "Title"
            },
            "phone": {
              "type": "string",
              "title": "Phone Number"
            },
            "email": {
              "type": "string",
              "title": "Email"
            }

          }
        },
        "eligibilitystatement": {
            "type": "object",
            "title": "Eligibility Statement",
            "properties": {
                "forprofit": {
                    "type": "boolean",
                    "title": "My firm is a:for-profit business,with a place of business located in the United States,and which operates primarily within the United States or which makes a significant contribution to the U.S. economy through payment of taxes or use of American products, materials or labor."
                },
                "ownership": {
                    "type": "boolean",
                    "title": "My firm’s ownership and control structure is:more than 50% owned and controlled by individuals who are citizens of or permanent resident aliens in the US, ormore than 50% owned and controlled by one or more other small businesses each of which is more than 50% owned and controlled by individuals who are citizens of or permanent resident aliens in the US, or a combination of the above two choices; or more than 50% owned by more than one Venture Capital Operating Company (VCOC), Hedge Fund, or Private Equity Firm (with no one such firm owning more than 50%), and I am applying to an SBIR agency that is using Section 5107 authority to use a percentage of its SBIR funds for awards to such firms."
                },
                "lessthanfivehundred": {
                    "type": "boolean",
                    "title": "I certify that my firm, together with all its affiliates, does not exceed 500 employees."
                }
            }
        }
      }
    };
  }
  res.json(jsonData);
};

exports.formsPost = function(req, res) {
  console.log("Form POST:" + req.params.id);
};
