import {AfterViewInit, Component, ElementRef, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute} from '@angular/router';
import {SchoolService} from './school.service';
import {NgSelectComponent} from '@ng-select/ng-select';
import {quesJson} from './questionJson';
declare const $: any;
declare var require: any;
var moment = require('moment');

const JsonQuestions = quesJson;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class AppComponent implements OnInit, AfterViewInit {

  // @ts-ignore
  @ViewChild('select') select: NgSelectComponent;
  title = 'chatBot';
  chatLog: any = [];
  questionLoaded = true;
  currentStep = 0;
  chatJson: any = {questions: []};
  chatForm: FormGroup;
  minDate = new Date();
  showInput = true;
  currentId = 0;
  urlMasterParameter: any;
  today: any;
  chatMd: any;
  errorOccurred = false;
  dateTimeArray = [{value: '08:00', title: '08:00 AM'}, {value: '08:30', title: '08:30 AM'}, {
    value: '09:00',
    title: '09:00 AM'
  }, {value: '09:30', title: '09:30 AM'}, {value: '10:00', title: '10:00 AM'}, {
    value: '10:30',
    title: '10:30 AM'
  }, {value: '11:00', title: '11:00 AM'}, {value: '11:30', title: '11:30 AM'}, {
    value: '12:00',
    title: '12:00 PM'
  }, {value: '14:00', title: '02:00 PM'}, {value: '14:30', title: '02:30 PM'}, {
    value: '15:00',
    title: '03:00 PM'
  }, {value: '15:30', title: '03:30 PM'}, {value: '16:00', title: '04:00 PM'}];


  // WIDTH = 640;
  // HEIGHT = 480;

  @ViewChild('video')
  public video!: ElementRef;

  @ViewChild('canvas')
  public canvas!: ElementRef;

  captures!: string;
  error: any;
  isCaptured = false;
  startCamera = false;
  localstream: any;
  error4: boolean = false;
  LoginStep = 'ID';
  loginForm!: FormGroup;
  datePickerConfig = {
    format: 'YYYY-MM-DD',
    disableKeypress: true,
    min: '2021-05-22',
    max: '2021-05-24',
    displayDate: '2021-06-22'
    // isDayDisabledCallback: (d:any) => [0, 6].includes(d.day())
  };
  date: any;
  stream_width: number | undefined;
  stream_height: number | undefined;

  constructor(private fb: FormBuilder, private http: HttpClient, private route: ActivatedRoute, private service: SchoolService, el: ElementRef) {

    this.chatForm = this.fb.group({});
    this.loginForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]]
    });
    const n = new Date();
    this.chatMd = false;
    this.today = n.getFullYear() + '-' + (n.getMonth() + 1 + 1000).toString().substring(2)
      + '-' + (n.getDate() + 1 + 1000).toString().substring(2);


    try {
      var height = $(window).height();
      console.log($)
      $(window).resize(function () {
        
        if ($(window).height() == height) return;
        var chatLogContainer = document.getElementById("chat-log");
        if(chatLogContainer){
          (chatLogContainer as HTMLElement).scrollTop = chatLogContainer.scrollHeight
        }
        height = $(window).height();
      });
    } catch (error) {
      console.log(error)
    }
  }


  onFocus(): void{
    setTimeout((): void => {
      // @ts-ignore
      document.getElementById('chat-log').scrollBy(0, 10000);
    }, 400);
  }

  selectQuestionInputChange(id?: any): void {
    this.pushQuestionAnswerToSCQ();
    this.showInput = false;
    this.questionLoaded = false;
    this.apiHandler();
  }

  updateDate(id: any, type: string): void {
    let date;
    // @ts-ignore
    if (!this.date) {
      return;
    } else {

      date = moment(this.date).format(this.chatJson.questions[this.currentStep].validations?.['format'] ? this.chatJson.questions[this.currentStep]?.validations?.['format'] : 'YYYY-MM-DD');
      console.log(date);
    }
    // console.log(id, document.getElementById('date___ques'+id).value, document.getElementById('time___ques'+id).value)
    document.getElementById('time___ques' + id)?.focus();
    if (type == 'DATETIME') {
      // @ts-ignore
      this.chatForm.controls['ques' + id].patchValue(date + ' ' + document.getElementById('time___ques' + id).value);
    } else {
      this.chatForm.controls['ques' + id].patchValue(date);
    }

  }

  handleResponse(val: any): void {
    let responseMessage = null;
    responseMessage = val?.display_message_in_chat || null;
    if (!this.currentId) {
      this.currentId = val?.response?.leadId || null;
    }
    this.questionLoaded = true;
    // this.pushQuestionAnswer();
    if (this.chatJson.questions[this.currentStep]?.type !== 'HTML') {
      this.assignCurrentIndex();
    } else {
      if ('jump_to' in this.chatJson.questions[this.currentStep]) {
        this.handleJumpTo();
      }
    }
    if (responseMessage) {
      // console.log(this.chatLog)
      this.chatLog.push({
        api_response: true,
        question: responseMessage,
        // "answer":responseMessage
      });
    }
    setTimeout((): void => {
      this.showInput = true;
      // @ts-ignore
      document.getElementById('chat-log').scrollBy(0, 10000);
    }, 100);
  }

  apiHandler(): void {
    if (this.chatJson.questions[this.currentStep]?.submit_endpoint) {
      const submitBody = {};
      this.chatJson.questions.forEach((val: any) => {
        if (this.chatForm.value['ques' + val.id]) {
          // @ts-ignore
          submitBody[val.api_key] = this.chatForm.value['ques' + val.id];
        }
      });
      let methodType = '';
      if (this.chatJson.questions[this.currentStep]?.submit_endpoint_method) {
        methodType = this.chatJson.questions[this.currentStep]?.submit_endpoint_method === 'PATCH' ? 'apiPatch' : 'apiPost';
      } else {
        methodType = 'apiPost';
      }
      // @ts-ignore
      submitBody.chat = this.getChatBotLog();
      if (this.currentId) {
        // @ts-ignore
        submitBody.id = this.currentId;
      }
      // @ts-ignore
      this.service[methodType]({
        ...submitBody,
        url___Parameters: JSON.stringify(this.urlMasterParameter) || null
      }, this.chatJson.questions[this.currentStep]?.submit_endpoint).subscribe((val: any) => {
        // console.log(val);
        this.handleResponse(val);
      }, (error: any) => {
        this.errorHandler();
      });
    } else if ((this.chatJson.questions[this.currentStep]?.post_lead && this.chatJson.questions[this.currentStep]?.post_lead === true) || this.chatJson.questions[this.currentStep]?.type === 'HTML') {
      const submitBody = {};
      this.chatJson.questions.forEach((val: any) => {
        if (this.chatForm.value['ques' + val.id]) {
          if (val.type === 'DATETIME') {
            // @ts-ignore
            submitBody[val.api_key] = this.returnProperDate(new Date(this.chatForm.value['ques' + val.id]));
          } else {
            // @ts-ignore
            submitBody[val.api_key] = this.chatForm.value['ques' + val.id];
          }
        }
      });
      // @ts-ignore

      submitBody.chat = this.getChatBotLog();
      let apiType = '';
      if (this.currentId) {
        // @ts-ignore
        submitBody.id = this.currentId;
        apiType = 'editLead';
      } else {
        apiType = 'postLead';
      }
      // @ts-ignore
      this.service[apiType]({
        ...submitBody,
        // @ts-ignore
        mobile: submitBody.mobile,
        // @ts-ignore
        name: submitBody.name || '',
        // @ts-ignore
        message: submitBody.message || '',
        chat: this.getChatBotLog(),
        // @ts-ignore
        tourTime: submitBody.tourTime ? this.returnProperDate(new Date(submitBody.tourTime)) : '',
        url___Parameters: JSON.stringify(this.urlMasterParameter) || null
      }).subscribe((val: any) => {
        // console.log(val);
        this.handleResponse(val);
      }, (error: any) => {
        this.errorHandler();
      });
    } else {
      this.questionLoaded = true;
      this.assignCurrentIndex();
      setTimeout((): void => {
        this.showInput = true;
        // @ts-ignore
        document.getElementById('chat-log').scrollBy(0, 10000);
      }, 100);
    }
  }

  inputQuestionInputChange(id?: any): void {
    // this.pushQuestionAnswer();
    console.log(this.chatForm);
    if (this.chatForm.get(id)?.valid) {
      this.pushQuestionAnswer();
      this.showInput = false;
      this.questionLoaded = false;
      this.apiHandler();
      this.startCamera = false;
      this.isCaptured = false;
      this.date = null;
    } else {
      this.chatForm.get(id)?.markAsTouched();
    }
    // console.log(this.chatForm.value);
  }

  errorHandler(): void {
    this.questionLoaded = true;
    this.errorOccurred = true;
    this.chatLog.push({
      api_response: true,
      question: 'Some error has occurred. Please refresh'
    });
    setTimeout((): void => {
      // @ts-ignore
      document.getElementById('chat-log').scrollBy(0, 10000);
    }, 300);
    console.log('error occured');
  }

  checkChatBoxSizeConfig(): void {
    try {
      if (this.chatJson.questions[this.currentStep] && this.chatJson.questions[this.currentStep]['chat-sm'] && this.chatJson.questions[this.currentStep]['chat-sm'] == true) {
        this.chatMd = true;
        (window as any).parent.postMessage({
          'func': 'updateIframeHeight',
          'message': this.chatJson.questions[this.currentStep]['chat-sm-height'] || '270px'
        }, '*');
      } else {
        this.chatMd = false;
        (window as any).parent.postMessage({
          'func': 'updateIframeHeight',
          'message': '75vh'
        }, '*');
      }
    } catch (error) {

    }
  }

  handleJumpTo(): void {
    if (this.chatJson.questions[this.currentStep].type === 'HTML') {
      this.chatLog.push({
        display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
        question: this.chatJson.questions[this.currentStep].question,
        answer: null
      });
    }
    console.log(this.chatJson.questions[this.currentStep]);
    this.currentStep = this.returnIndex(this.chatJson.questions[this.currentStep]['jump_to']);
    if (this.chatJson.questions[this.currentStep].type === 'SCQ') {
      this.chatForm.patchValue({
        ['ques' + this.chatJson.questions[this.currentStep].id]: null
      });
    }
    console.log(this.chatForm.value);
    this.handleQuestionType();
  }

  handleConditionalJumpTo(index: number): void {
    this.currentStep = index;
    if (this.chatJson.questions[this.currentStep].type === 'SCQ') {
      this.chatForm.patchValue({
        ['ques' + this.chatJson.questions[this.currentStep].id]: null
      });
    }
    console.log(this.chatForm.value);
    this.handleQuestionType();
  }

  assignCurrentIndex(): void {
    if ('jump_to' in this.chatJson.questions[this.currentStep]) {
      this.handleJumpTo();
    } else {
      if ('conditional_jump' in this.chatJson.questions[this.currentStep]) {
        const quesVal = this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id];
        if (this.chatJson.questions[this.currentStep]['conditional_jump'][quesVal]) {
          this.handleConditionalJumpTo(this.chatJson.questions[this.currentStep]['conditional_jump'][quesVal]);
          return;
        }
      }
      for (let i = this.currentStep + 1; i < this.chatJson.questions.length; i++) {

        if (this.chatJson.questions[i].show_if) {
          // @ts-ignore
          // console.log(this.chatForm.value['ques' + this.chatJson.questions[i].show_if.qid]);
          // @ts-ignore
          if (this.chatForm.value['ques' + this.chatJson.questions[i].show_if.qid]) {
            let currentStepChanged = false;
            // @ts-ignore
            this.chatJson.questions[i].show_if.value.forEach(val => {
              // @ts-ignore
              if (val === this.chatForm.value['ques' + this.chatJson.questions[i].show_if.qid]) {
                this.currentStep = i;
                if (this.chatJson.questions[i].type === 'DATETIME' || this.chatJson.questions[i].type === 'DATE') {
                  this.getConfig(i);
                }
                currentStepChanged = true;
              }
            });
            if (currentStepChanged) {
              break;
            }
          }
        } else {
          this.currentStep = i;
          if (this.chatJson.questions[i].type === 'DATETIME' || this.chatJson.questions[i].type === 'DATE') {
            this.getConfig(i);
          }
          // debugger
          break;
        }
      }
      this.checkChatBoxSizeConfig();
      this.handleQuestionType();
    }
  }

  getChatBotLog() {
    // @ts-ignore
    let tempChatLog = [];
    // @ts-ignore
    (this.chatLog || []).forEach((question) => {
      delete question['display_question_as'];
      tempChatLog.push(question);
    });
    // @ts-ignore
    return JSON.stringify(tempChatLog);
  }

  handleQuestionType(): void {
    this.questionLoaded = false;
    if (this.chatJson.questions[this.currentStep].type === 'HTML') {
      console.log('Thank ques');
      console.log(this.chatJson.questions[this.currentStep]);
      if ('call_api' in this.chatJson.questions[this.currentStep] && !this.chatJson.questions[this.currentStep].call_api) {
        if ('jump_to' in this.chatJson.questions[this.currentStep]) {
          this.handleJumpTo();
        }
      } else {
        this.apiHandler();
      }
    }
    if (this.chatJson.questions[this.currentStep].type === 'AUTOCOMPLETE_DYNAMICOPTIONS') {
      this.chatJson.questions[this.currentStep].options = [];
      this.service.getUrlOptions(this.chatJson.questions[this.currentStep].url).subscribe((val: any) => {
        const options = val?.response?.data || val?.response || [];
        this.chatJson.questions[this.currentStep].options = [];

        options.forEach((value: any) => {
          let answer = '';
          this.chatJson.questions[this.currentStep]?.possible_values.forEach((poss: any, i: number) => {
            const isComma = i !== this.chatJson.questions[this.currentStep]?.possible_values.length - 1 ? ', ' : '';
            answer += value[poss] + isComma || '';
          });
          this.chatJson.questions[this.currentStep].options.push({
            value: value[this.chatJson.questions[this.currentStep]?.attribute_rhs] ? value[this.chatJson.questions[this.currentStep]?.attribute_rhs].toString() : null,
            display_value: answer
          });
        });

        this.questionLoaded = true;
        setTimeout((): void => {

          if (this.chatJson.questions[this.currentStep].prefill_value_from) {
            if (this.chatJson.questions[this.currentStep].prefill_value_from === 'url') {
              const value = this.urlMasterParameter[this.chatJson.questions[this.currentStep].prefill_value_key] || null;
              // this.select.bindValue=value;
            }
          }
          // @ts-ignore
          document.getElementById('chat-log').scrollBy(0, 10000);
          this.select.focus();
        }, 300);
      }, (error: any) => {
        this.errorHandler();
      });
    } else if (this.chatJson.questions[this.currentStep].type === 'SCQ') {
      if (this.chatJson.questions[this.currentStep].url) {
        let additional = '';
        const submitBody = {};
        this.chatJson.questions.forEach((val: any) => {
          if (this.chatForm.value['ques' + val.id]) {
            // @ts-ignore
            submitBody[val.api_key] = this.chatForm.value['ques' + val.id];
          }
        });
        console.log(submitBody);
        if (this.chatJson.questions[this.currentStep].send_with_url) {
          // @ts-ignore
          additional = '?' + this.chatJson.questions[this.currentStep].send_with_url + '=' + submitBody[this.chatJson.questions
            [this.currentStep].send_with_url] || '';
        }
        this.chatJson.questions[this.currentStep].options = [];
        this.service.getUrlOptions(this.chatJson.questions[this.currentStep].url + additional).subscribe((val: any) => {
          const options = val?.response?.data || val?.response || [];
          this.chatJson.questions[this.currentStep].options = options || [];
          if (this.chatJson.questions[this.currentStep].possible_values && this.chatJson.questions[this.currentStep].attribute_rhs) {
            this.chatJson.questions[this.currentStep].options = [];
            options.forEach((value: any) => {
              let answer = '';
              this.chatJson.questions[this.currentStep]?.possible_values.forEach((poss: any, i: number) => {
                const isComma = i !== this.chatJson.questions[this.currentStep]?.possible_values.length - 1 ? ', ' : '';
                answer += value[poss] + isComma || '';
              });
              this.chatJson.questions[this.currentStep].options.push({
                api_value: value[this.chatJson.questions[this.currentStep]?.attribute_rhs],
                display_value: answer
              });
            });
          }
          this.questionLoaded = true;
          setTimeout((): void => {
            // @ts-ignore
            document.getElementById('chat-log').scrollBy(0, 10000);
          }, 300);
        }, (error: any) => {
          this.errorHandler();
        });
      } else {
        this.questionLoaded = true;
      }

      if (this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]) {
        this.chatForm.patchValue({
          ['ques' + this.chatJson.questions[this.currentStep].id]: null
        });
      }

    } else {
      this.questionLoaded = true;
    }

    setTimeout((): void => {
      // @ts-ignore
      document.getElementById('chat-log').scrollBy(0, 10000);
    }, 300);
  }

  refresh(): void {
    this.errorOccurred = false;
    this.questionLoaded = true;
    this.showInput = true;
    this.initialiseForm();
    this.currentStep = 0;
    this.currentId = 0;
    this.chatLog = [];
    this.startCamera = false;
    this.isCaptured = false;
    this.loginForm.reset();
    this.date = null;
    // this.el.nativeElement.innerHTML = '';
    this.LoginStep = 'ID';
  }

  returnFormControl(name: any): any {
    return this.chatForm.get(name);
  }

  skipQuestion(): void {
    this.chatLog.push({
      display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
      question: this.chatJson.questions[this.currentStep].question,
      answer: null
    });
    this.assignCurrentIndex();
  }

  pushQuestionAnswer(): void {
    if (this.chatJson.questions[this.currentStep].type === 'DATETIME') {
      // @ts-ignore
      this.chatLog.push({
        display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
        question: this.chatJson.questions[this.currentStep].question,
        answer: this.returnProperDateAmerican(new Date(this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]))
      });
    } else if (this.chatJson.questions[this.currentStep].type === 'AUTOCOMPLETE_DYNAMICOPTIONS') {
      // tslint:disable-next-line:max-line-length
      const selectedObject = this.chatJson.questions[this.currentStep].options.find((item: any) => item.value === this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]);
      this.chatLog.push({
        display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
        question: this.chatJson.questions[this.currentStep].question,
        answer: selectedObject.display_value
      });
    } else if (this.chatJson.questions[this.currentStep].type === 'CAMERA' || this.chatJson.questions[this.currentStep].type === 'FULLCAMERA') {
      this.chatLog.push({
        display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
        question: this.chatJson.questions[this.currentStep].question,
        answer: this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id],
        // answer: `<img class="attach-image" src="${this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]}" >`,
        file: 'image'
      });
    } else if (this.chatJson.questions[this.currentStep].type === 'FILE') {
      let extension;
      extension = this.getFileExtension(this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]);
      if (extension == 'pdf') {
        this.chatLog.push({
          display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
          question: this.chatJson.questions[this.currentStep].question,
          answer: this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id],
          // answer: `<a href="${this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]}"><img class="doc-icons" src="./assets/pdf.png" >`,
          file: 'pdf'
        });
      } else if (extension == 'csv' || extension == 'xlsx') {
        this.chatLog.push({
          display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
          question: this.chatJson.questions[this.currentStep].question,
          answer: this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id],
          // answer: `<a href="${this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]}"><img class="doc-icons" src="./assets/excel.png" >`,
          file: 'csv'
        });
      } else if (extension == 'png' || extension == 'jpeg' || extension == 'jpg') {
        this.chatLog.push({
          display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
          question: this.chatJson.questions[this.currentStep].question,
          answer: this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id],
          // answer: `<img class="attach-image" src="${this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]}" >`,
          file: 'image'
        });
      } else {
        this.chatLog.push({
          question: this.chatJson.questions[this.currentStep].question,
          answer: this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id],
          file: 'doc'
        });
      }
    } else {
      this.chatLog.push({
        display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
        question: this.chatJson.questions[this.currentStep].question,
        answer: this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]
      });
    }
  }

  getFileExtension(filename: any) {

    // get file extension
    const extension = filename.split('.').pop();
    return extension;
  }

  pushQuestionAnswerToSCQ(): void {
    this.chatLog.push({
      display_question_as: (this.chatJson.questions[this.currentStep]?.display_question_as && this.chatJson.questions[this.currentStep]?.display_question_as === 'HTML') ? 'HTML' : 'TEXT',
      question: this.chatJson.questions[this.currentStep].question,
      // @ts-ignore
      // tslint:disable-next-line:max-line-length
      answer: this.chatJson.questions[this.currentStep].options.find(item => item.api_value === this.chatForm.value['ques' + this.chatJson.questions[this.currentStep].id]).display_value
    });
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      // console.log(params);
      this.urlMasterParameter = params || {};
      if (params?.chatName) {
        this.questionLoaded = false;
        let url = 'https://be11.platform.simplifii.com/api/v1/static';
        if (params?.scriptUrl) {
          url = params?.scriptUrl;
        }
        this.service.getConfigJson(url, params.chatName).subscribe((val: { response: { data: never[]; }; }) => {
          // this.chatJson.questions = JsonQuestions || [];
          this.chatJson.questions = val?.response?.data || [];
          if (this.chatJson.questions[0].type === 'DATETIME' || this.chatJson.questions[0].type === 'DATE') {
            this.getConfig(0);
          }
          this.handleQuestionType();
          setTimeout(() => {
            this.checkChatBoxSizeConfig();
          }, 500);
          this.initialiseForm();
          this.questionLoaded = true;
        }, (error: any) => {
          this.questionLoaded = true;
          this.errorOccurred = true;
          this.chatLog.push({
            api_response: true,
            question: 'The chat script is invalid'
          });
        });
      }
    });
    // this.initialiseForm();
    // console.log(this.chatForm);
  }

  returnIndex(id: any): any {
    return this.chatJson.questions.findIndex((value: { id: any; }) => value.id === id);
  }

  initialiseForm(): void {
    this.chatForm = this.fb.group({});
    this.chatJson.questions.forEach((element: any) => {
      const validatorsArray = [];
      if (element.mandatory && element.mandatory === true) {
        validatorsArray.push(Validators.required);
      }
      if (element.validations) {
        if (element.validations.min_value) {
          validatorsArray.push(Validators.min(element.validations.min_value));
        }
        if (element.validations.max_value) {
          validatorsArray.push(Validators.max(element.validations.max_value));
        }
        if (element.validations.min_length) {
          validatorsArray.push(Validators.minLength(element.validations.min_length));
        }
        if (element.validations.max_length) {
          validatorsArray.push(Validators.maxLength(element.validations.max_length));
        }
        if (element.validations.format) {
          if (element.validations.format === 'email') {
            validatorsArray.push(Validators.pattern(/^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/));
          }
        }
      }
      if (element.prefill_value_from) {
        if (element.prefill_value_from === 'url') {
          const value = this.urlMasterParameter[element?.prefill_value_key] || null;
          this.chatForm.addControl('ques' + element.id, this.fb.control(value, validatorsArray));
        }
      } else {
        this.chatForm.addControl('ques' + element.id, this.fb.control(null, validatorsArray));
      }
    });
  }

  returnProper(num: number): any {
    return num < 10 ? '0' + num : num;
  }

  returnProperDate(date: any): any {
    return this.getDateFormat(date) + ' ' + this.returnProper(date.getHours()) + ':'
      + this.returnProper(date.getMinutes()) + ':' + this.returnProper(date.getSeconds());
  }

  returnProperDateAmerican(date: any): any {
    return this.getDateFormatAmerican(date) + ' ' + this.returnProper(date.getHours()) + ':'
      + this.returnProper(date.getMinutes()) + ':' + this.returnProper(date.getSeconds());
  }

  getDateFormat(d: any): any {
    let day;
    if (d.getMonth() < 9) {
      if (d.getDate() < 10) {
        return day = d.getFullYear() + '/0' + (d.getMonth() + 1) + '/0' + d.getDate();
      } else {
        return day = d.getFullYear() + '/0' + (d.getMonth() + 1) + '/' + d.getDate();
      }
    } else {
      if (d.getDate() < 10) {
        return day = d.getFullYear() + '/' + (d.getMonth() + 1) + '/0' + d.getDate();
      } else {
        return day = d.getFullYear() + '/' + (d.getMonth() + 1) + '/' + d.getDate();
      }
    }
  }

  getDateFormatAmerican(d: any): any {
    let day;
    if (d.getMonth() < 9) {
      if (d.getDate() < 10) {
        return day = '0' + (d.getMonth() + 1) + '/0' + d.getDate() + '/' + d.getFullYear();
      } else {
        return day = '0' + (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
      }
    } else {
      if (d.getDate() < 10) {
        return day = (d.getMonth() + 1) + '/0' + d.getDate() + '/' + d.getFullYear();
      } else {
        return day = (d.getMonth() + 1) + '/' + d.getDate() + '/' + d.getFullYear();
      }
    }
  }


  ngAfterViewInit(): void {

  }

  async setupDevices(id: any) {

    this.chatForm.patchValue({['ques' + id]: null});
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      try {
        let check = 'user';
        (function(a) {
          if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
            check = 'environment';
          }
        })(navigator.userAgent || navigator.vendor);

        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: {
              exact: check
            }
          }
        });
        this.localstream = stream;
        let stream_settings = stream.getVideoTracks()[0].getSettings();
        this.stream_width = stream_settings.width;
        this.stream_height = stream_settings.height;
        if (stream) {
          this.video.nativeElement.srcObject = stream;
          this.video.nativeElement.play();
          this.error = null;
          this.startCamera = true;
          this.isCaptured = false;
        } else {
          this.chatForm.get('ques' + id)?.markAsTouched();
        }
      } catch (e) {
        window.alert('Camera permission needed to capture image');
        this.chatForm.get('ques' + id)?.markAsTouched();
        this.error = e;
      }
    }
  }

  capture(id: any) {
    this.startCamera = false;
    this.drawImageToCanvas(this.video.nativeElement, id);
  }

  removeCurrent() {
    this.isCaptured = false;
  }

  drawImageToCanvas(image: any, id: any) {
    console.log(this.video.nativeElement);
    this.canvas.nativeElement
      .getContext('2d')
      .drawImage(image, 0, 0);
    this.isCaptured = true;
    this.captures = this.canvas.nativeElement.toDataURL('image/png');
    var blob: Blob = this.dataURItoBlob(this.captures);
    let file = new File([blob], 'chatBotImage.jpg', {type: 'image/jpeg'});
    this.uploadFile(file, id);
  }

  uploadFile(file: File, id: any) {
    let form = new FormData();
    form.append('file', file, file.name);
    console.log(form);
    this.service.uploadFile(form, this.urlMasterParameter['token']).subscribe((res: any) => {
      console.log({[id]: res['response']['data']['url']});
      this.chatForm.patchValue({['ques' + id]: res['response']['data']['url']});
      this.localstream.getTracks()[0].stop();
      this.startCamera = false;
    }, (error) => {
      console.log(error['error']['msg']);
    });

  }

  dataURItoBlob(dataURI: any) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(',')[1]);

    // separate out the mime component
    var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    //Old Code
    //write the ArrayBuffer to a blob, and you're done
    //var bb = new BlobBuilder();
    //bb.append(ab);
    //return bb.getBlob(mimeString);

    //New Code
    return new Blob([ab], {type: mimeString});


  }

  onFileChange(event: any, chatJson: any) {
    let file = event.target.files[0];
    console.log(file.size / (1024 * 1024));
    if (chatJson['validations'] && chatJson.validations['max_size'] && file.size > chatJson.validations['max_size'] * 1024 * 1024) {
      this.error4 = true;
      this.chatForm.get('ques' + chatJson.id)?.markAsTouched();
      // @ts-ignore
      document.getElementById('chat-input4').value = null;
      return;

    } else if (chatJson['validations'] && chatJson.validations['min_size'] && file.size < chatJson.validations['min_size'] * 1024 * 1024) {
      this.error4 = true;
      console.log(this.chatForm.controls, chatJson.id);
      this.chatForm.get('ques' + chatJson.id)?.markAsTouched();
      // // @ts-ignore
      // document.getElementById('chat-input5').value = null;
      return;
    } else {
      this.error4 = false;
      let uploadData = new FormData();
      uploadData.append('file', file, file.name);
      console.log(file);
      this.service.uploadFile(uploadData, this.urlMasterParameter['token']).subscribe((res: any) => {
        this.chatForm.patchValue({['ques' + chatJson.id]: res['response']['data']['url']});
        this.inputQuestionInputChange('ques' + chatJson.id);
      }, (error) => {
        console.log(error['error']['msg']);
      });
    }
  }

  triggerFalseClick() {
    let file = document.createElement('input');
    file.setAttribute('type', 'file');
    if (this.chatJson.questions[this.currentStep].validations.type) {
      file.setAttribute('accept', this.chatJson.questions[this.currentStep].validations.type);
    }
    file.click();
    file.onchange = (e) => {
      this.onFileChange(e, this.chatJson.questions[this.currentStep]);
    };
  }

  Login() {
    console.log(this.loginForm.value);
    if (this.LoginStep == 'PASSWORD' && !this.loginForm.value.password) {
      this.loginForm['controls'].password.markAsTouched();
      return;
    } else if (this.loginForm.value.password) {
      this.LoginStep = 'ID';
      this.assignCurrentIndex();
    }
    if (!this.loginForm.value.username) {
      this.loginForm['controls'].username.markAsTouched();
      return;
    } else {
      this.LoginStep = 'PASSWORD';
    }

  }

  getConfig(i: any) {
    let n = this.chatJson.questions[i]?.validations;
    let date = moment(new Date()).format('YYYY-MM-DD'),
      max, min, formt = 'YYYY-MM-DD', display_date = date;

    if (n) {
      if (n['max_date'] || n['max_date'] == 0) {
        max = moment(date).add(n['max_date'], 'd');
      }
      if (n['min_date'] || n['min_date'] == 0) {
        min = moment(date).subtract(n['min_date'], 'd');
      }
      if (n['format']) {
        formt = n['format'];
      }
      if (n['displayDate']) {
        display_date = moment(date).add(n['displayDate'], 'd');
      }
    }
    this.datePickerConfig = {
      format: formt,
      disableKeypress: true,
      min: min,
      max: max,
      displayDate: display_date
    };
  }
}
