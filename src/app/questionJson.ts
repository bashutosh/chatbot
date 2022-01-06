export let quesJson: any;
quesJson = [
  {
    "id": 1,
    "api_key": "q1",
    "question": "<h2>What do you need help with?</h2>",
    "type": "SCQ",
    "mandatory": true,
    "display_question_as": "HTML",
    "options": [
      {
        "api_value": "abc",
        "display_value": "I am looking for care for my child"
      },
      {
        "api_value": "xyz",
        "display_value": "I am still exploring"
      }
    ]
  },
  {
    "id": 945,
    "api_key": "date",
    "validations":{
    "max_date":40,
    "min_date":0,
    "format":"YYYY/MM/DD"
    },
    "show_if": {
      "qid": 1,
      "value": [
        "xyz"
      ]
    },
    "type": "DATE",
    "placeholder_text": "Enter a date",
    "error_text": "Please enter a valid date",
    "mandatory": true,
    "question": "Please click/tap on calendar icon below to pick the preferred date for the Tour/Call"
  },
  {
    "id": 2,
    "api_key": "q2",
    "show_if": {
      "qid": 1,
      "value": [
        "xyz"
      ]
    },
    "type": "TEXT",
    "display_question_as": "HTML",
    "mandatory": true,
    "placeholder_text": "Type a message",
    "error_text": "Please enter what you require",
    "question": "<!doctype html> <html> <head> <meta charset='UTF-8'> <title>Simple Responsive HTML Email Template</title> <style> * { box-sizing: border-box; -moz-box-sizing: border-box; } html, body { background: #eeeeee; font-family: 'Open Sans', sans-serif, Helvetica, Arial; } img { max-width: 100%; } /* This is what it makes reponsive. Double check before you use it! */ @media only screen and (max-width: 480px) { table tr td { width: 100% !important; float: left; } } </style> </head> <body style='background: #eeeeee; padding: 10px; font-family: 'Open Sans' , sans-serif, Helvetica, Arial;'> <center> <!-- Let's Center it. just in case email client does not support margin: 0 auto --> <!-- ** Top Message -----------------------------------> <p style='text-align: center; color: #666666; font-size: 12px; margin: 10px 0;'> If you can't see this message <a href='#' target='_blank'>View it in your browser</a>. </p> <!-- ** Table begins here -----------------------------------> <!-- Set table width to fixed width for Outlook(Outlook does not support max-width) --> <table width='100%' cellpadding='0' cellspacing='0' bgcolor='FFFFFF' style='background: #ffffff; max-width: 600px !important; margin: 0 auto; background: #ffffff;'> <tr> <td style='padding: 20px; text-align: center; background: #76ce3e;'> <h1 style='color: #ffffff'>A Simple HTML Email Template</h1> </td> </tr> <tr> <td style='padding: 20px; text-align: center;'> <!-- ** 100% width -----------------------------------> <p style='font-size:30px; margin: 5px;'>100% width table</p> <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam placerat, leo id facilisis facilisis, eget ultrices augue erat id tellus.</p> <p style='border-radius: 40px; -moz-border-radius: 40px; padding: 15px 20px; margin: 10px auto; background: #76ce3e; display: inline-block;'> <a href='tel:8888888888' style='color: #fff; text-decoration: none;'>Call Us (888) 888-8888</a> </p> </td> </tr> <tr> <td> <img src='https://res.cloudinary.com/simplifiidevops/image/upload/v1619582783/temp/sf.jpg' /> </td> </tr> <tr> <td style='padding: 20px;'> <!-- ** 30% and 70% -----------------------------------> <table border='0' cellpadding='0'> <tr> <td width='30%' style='width: 30%; padding: 10px;'> <img src='https://res.cloudinary.com/psnm/image/upload/v1619582770/profile_trgy6b.jpg' /> </td> <td width='70%' style='width: 70%; padding: 10px; text-align: left;'> <h3>Say Something | 70% width</h3> <p>Etiam placerat, leo id facilisis facilisis, sem tortor efficitur velit, eget ultrices augue erat id tellus.</p> <p style='color: #666666; font-size: 12px;'>Small Font Sample</p> </td> </tr> </table> </td> </tr> <tr> <td style='padding: 20px; background: #2B2E34;'> <!-- ** 50% and 50% -----------------------------------> <table border='0' cellpadding='0' cellspacing='0' a> <tr> <td width='50%' style='width: 50%; padding: 10px; color: #ffffff; text-align: left;' valign='top'> <h2>About us</h2> <p style='font-size: 14px;'>Nam porta tellus sit amet lacus efficitur iaculis. Vestibulum massa orci, accumsan at mollis molestie, condimentum sed tortor. Duis dolor risus, sagittis vitae orci sit amet, sodales tristique risus.</p> </td> <td width='50%' style='width: 50%; padding: 10px; color: #ffffff; text-align: left;' valign='top'> <h2>Contact us</h2> <!-- ** Footer contact -----------------------------------> <table border='0' style='font-size: 14px;'> <tr> <td>Call: (888) 888-8888</td> </tr> <tr> <td>email: sample@email.com</td> </tr> </table> </td> </tr> </table> </td> </tr> </table> <!-- ** Bottom Message -----------------------------------> <p style='text-align: center; color: #666666; font-size: 12px; margin: 10px 0;'> Copyright © 2. All&nbsp;rights&nbsp;reserved.<br /> If you do not want to recieve emails from us, you can <a href='#' target='_blank'>unsubscribe</a>. </p> </center> </body> </html>",
    "validations": {
      "min_length": 4,
      "max_length": 150
    }
  },
  {
    "id": 3,
    "api_key": "mobile",
    "show_if": {
      "qid": 1,
      "value": [
        "xyz"
      ]
    },
    "type": "NUMBER",
    "placeholder_text": "Enter a 10 digit phone number. No spaces..",
    "error_text": "This is not a valid phone no",
    "post_lead": true,
    "mandatory": true,
    "question": "Thanks for your response. I can have my team member contact you to provide assistance. May I get your contact number?",
    "validations": {
      "min_value": 1000000000,
      "max_value": 9999999999
    }
  },
  {
    "id": 4,
    "api_key": "name",
    "show_if": {
      "qid": 1,
      "value": [
        "xyz"
      ]
    },
    "type": "TEXT",
    "placeholder_text": "Type your name",
    "error_text": "Please enter your name",
    "mandatory": true,
    "question": "May I also get your name please?",
    "validations": {
      "min_length": 4,
      "max_length": 150
    }
  },
  {
    "id": 5,
    "show_if": {
      "qid": 1,
      "value": [
        "xyz"
      ]
    },
    call_api: false,
    "type": "HTML",
    "jump_to":1,
    "question": "Thanks for providing your information. Our team will contact you within 1-2 business days. Have a great day ahead:)"
  },
  {
    "id": 116,
    "api_key": "schoolID",
    "show_if": {
      "qid": 1,
      "value": [
        "abc"
      ]
    },
    "type": "AUTOCOMPLETE_DYNAMICOPTIONS",
    "placeholder_text": "Please type and then pick from list",
    "error_text": "Please pick a school",
    "mandatory": true,
    "question": "Please confirm the school you're interested in",
    "max_items": "ignore for now",
    "url": "https://preschoolsnearme.com/api/getSchoolsList",
    "is_mandatory": 1,
    "prefill_value_from": "url",
    "prefill_value_key": "schoolID",
    "possible_values": [
      "schoolName",
      "city",
      "zipcode"
    ],
    "attribute_rhs": "id"
  },
  {
    "id": 6,
    "api_key": "q6",
    "display_question_as": "TEXT",
    "show_if": {
      "qid": 1,
      "value": [
        "abc"
      ]
    },
    "type": "SCQ",
    "send_with_url": "schoolID",
    "mandatory": true,
    "question": "Are you looking for full time or part time care (If part time how many days)?",
    "url": "https://mocki.io/v1/e8108ad8-01c2-409d-b884-1d476225c8ff"
  },
  {
    "id": 7,
    "api_key": "q7",
    "show_if": {
      "qid": 1,
      "value": [
        "abc"
      ]
    },
    "type": "SCQ",
    "mandatory": true,
    "question": "Thanks for your interest. What do you need help with?",
    "options": [
      {
        "api_value": "a2",
        "display_value": "Question for the school"
      },
      {
        "api_value": "a3",
        "display_value": "Setup a call with the School Director"
      },
      {
        "api_value": "a4",
        "display_value": "Setup a tour at the school"
      }
    ]
  },
  {
    "id": 8,
    "api_key": "mobile",
    "show_if": {
      "qid": 1,
      "value": [
        "abc"
      ]
    },
    "type": "NUMBER",
    "placeholder_text": "Enter a 10 digit phone number. No spaces.. ",
    "error_text": "This is not a valid phone number",
    "post_lead": true,
    "mandatory": true,
    "question": "Thanks for your response. I can have my team member contact you to provide assistance. May I get your contact number?",
    "validations": {
      "min_value": 1000000000,
      "max_value": 9999999999
    }
  },
  {
    "id": 9,
    "api_key": "name",
    "show_if": {
      "qid": 1,
      "value": [
        "abc"
      ]
    },
    "type": "TEXT",
    "placeholder_text": "Type your name",
    "error_text": "Please enter your name",
    "mandatory": true,
    "question": "May I also get your name please?",
    "validations": {
      "min_length": 4,
      "max_length": 150
    }
  },
  {
    "id": 10,
    "api_key": "message",
    "type": "TEXT",
    "show_if": {
      "qid": 7,
      "value": [
        "a2"
      ]
    },
    "placeholder_text": "Type a message",
    "error_text": "Please enter what you require",
    "mandatory": true,
    "question": "Please summarize in 2 lines how we can assist you. Somebody from our team will contact you within 1 business day to assist.",
    "validations": {
      "min_length": 4,
      "max_length": 150
    }
  },
  {
    "show_if": {
      "qid": 7,
      "value": [
        "a2"
      ]
    },
    "id": 11,
    "type": "HTML",
    "jump_to":1,
    "question": "Thanks for your information. We look forward to contacting you within the next 24 hours to provide further assistance."
  },
  {
    "id": 16,
    "api_key": "tourTime",
    "show_if": {
      "qid": 7,
      "value": [
        "a3",
        "a4"
      ]
    },
    "type": "DATETIME",
    "placeholder_text": "Enter a date",
    "error_text": "Please enter a valid date",
    "mandatory": true,
    "question": "Please click/tap on calendar icon below to pick the preferred date for the Tour/Call"
  },
  {
    "id": 17,
    "show_if": {
      "qid": 7,
      "value": [
        "a3",
        "a4"
      ]
    },
    "type": "HTML",
    "jump_to":1,
    "question": "Thanks for providing your information. You appointment is confirmed. We look forward to discussing your family needs soon. Have a great day ahead."
  }
];
