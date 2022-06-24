import {LitElement, css, svg, html} from 'lit';
import { doneIcon, loadingIcon } from './icons.js';
import LoadingElt from "./loading.js";

const COURSES_ENDPOINT = "http://197.243.24.148/api/get-remote-courses.php";
const COURSE_DOWNLOAD_ENDPOINT = "download-remote-course.php?course_id=";
const COURSE_UPLOAD_TO_REMOTE_SERVER_ENDPOINT = "upload-course-to-remote-server.php?course_id=";

export class App extends LitElement{
    static styles = css`
    :host {
      display: block;
      height: calc(100vh - 420px);
      position: relative;
      overflow: auto
    }
    table{
      border-collapse: collapse;
      width: 100%;
      max-width: 700px;
      margin: auto;
    }
    table td, table th{
      border: 1px solid rgba(0, 0, 0, 0.125);
      padding: 8px;
      min-width: 24px;
    }
    .loading{
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
    .table-header{
      display: flex;
      width: 100%;
      max-width: 700px;
      margin: auto;
      padding: 8px 0px 24px 0px;
      flex-direction: row;
      justify-content: space-between;
      align-items: center;
    }
    .table-header button{
      height: 42px;
      background-color: #0f6fc5;
      border: 1px solid  #0f6fc5;
      color: #fff;
      cursor: pointer;
    }
    .table-header h1{
      font-size: 20px;
      
    }
    .index-column{
      position: relative;
    }
    .downloading, .download-complete{
      opacity: 0;
      position: absolute;
      left: -40px;


    }
    .tr-downloading{
      background: rgba(0, 0, 0, 0.1);
    }
    .downloading div{
      width: 18px;
      height: 18px
    }
    .downloading.visible, .download-complete.visible{
      opacity: 1;
    }

    /* Spinner Circle Rotation */
.sp-circle {
  border: 4px rgba(0, 0, 0, 0.25) solid;
  border-top: 4px black solid;
  border-radius: 50%;
  -webkit-animation: spCircRot 0.6s infinite linear;
  animation: spCircRot 0.6s infinite linear;
}

@-webkit-keyframes spCircRot {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(359deg);
  }
}
@keyframes spCircRot {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(359deg);
  }
}
  `;
  static properties = {
    _courses: {state: true}
  };
  static properties = {
    _loading: {state: true}
  };

  constructor(){
    super();
    this.getCourses();
    this._courses = {};
    this.loading = true;
    this.currentCourse
  }
  async getCourses(){
    const request = await fetch(COURSES_ENDPOINT);
    const result = await request.json();
    this._courses = result;
    this.loading = false;
    this.requestUpdate();
  }
  connectedCallback(){
    super.connectedCallback();
    const pageContentElt = document.querySelector("#page-content");
    const rect = pageContentElt?.getBoundingClientRect();
    if(rect)
      this.style.height = `${rect.height - 62}px`;
  }
    render(){
      
        return this.loading ? html`
        <div class="loading">
          ${svg`<svg width="64px" height="64px" viewBox="0 0 128 128"><rect x="0" y="0" width="100%" height="100%" fill="#fff"></rect><path fill="#1a237e" id="ball1" class="cls-1" d="M67.712,108.82a10.121,10.121,0,1,1-1.26,14.258A10.121,10.121,0,0,1,67.712,108.82Z"><animateTransform attributeName="transform" type="rotate" values="0 64 64;4 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;" dur="1000ms" repeatCount="indefinite"></animateTransform></path><path fill="#1a237e" id="ball2" class="cls-1" d="M51.864,106.715a10.125,10.125,0,1,1-8.031,11.855A10.125,10.125,0,0,1,51.864,106.715Z"><animateTransform attributeName="transform" type="rotate" values="0 64 64;10 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;0 64 64;" dur="1000ms" repeatCount="indefinite"></animateTransform></path><path fill="#1a237e" id="ball3" class="cls-1" d="M33.649,97.646a10.121,10.121,0,1,1-11.872,8A10.121,10.121,0,0,1,33.649,97.646Z"><animateTransform attributeName="transform" type="rotate" values="0 64 64;20 64 64;40 64 64;65 64 64;85 64 64;100 64 64;120 64 64;140 64 64;160 64 64;185 64 64;215 64 64;255 64 64;300 64 64;" dur="1000ms" repeatCount="indefinite"></animateTransform></path></svg>`}
        </div>

        ` 
        : html`
        <div class="table-header">
          <h1>List of available courses</h1>
          <button @click=${_=>this._downloadCourses()}>Download</button>
          <button @click=${_=>this._uploadAllCoursesUsersData()}>Upload</button>
        </div>
        <table>
          <thead>
            <tr>
              <th>#</th>
              <!-- <th>Course Id</th> -->
              <th>Course name</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            ${Object.values(this._courses).map((course, index)=>{
              const descriptionElt = document.createElement('span');
              descriptionElt.innerHTML = course.summary;
              if(course.id == 1) return;
              return html`<tr class=${`${!!course.downloading ? "tr-downloading" : ""}`}>
                <td class="index-column">
                  <span class=${`downloading ${!!course.downloading ? "visible" : ""}`}>
                    <div class="sp sp-circle"></div>
                  </span>
                  <span class=${`download-complete ${!!course.downloadComplete ? "visible" : ""}`}>${doneIcon}</span>
                  ${index + 1}
                </td>
                <!-- <td>${course.id}</td> -->
                <td>${course.fullname}</td>
                <td>${descriptionElt}</td>
              </tr>`;
            })}
          </tbody>
        </table>
        `;
    }

    async _downloadCourses(){

     for (const course of Object.values(this._courses)) {
       if(course.id == 1) continue;
       course.downloading = true;
       this._courses[course.id] = course;
       this.requestUpdate();
       const res = await this._downloadCourse(course.id);
       course.downloading = false;
       course.downloadComplete = true;
       this._courses[course.id] = course;
       this.requestUpdate();

     }
    }
    async _downloadCourse(courseId){
      const request = await fetch(`${COURSE_DOWNLOAD_ENDPOINT}${courseId}`);
      const resultString = await request.text();
      return JSON.parse(resultString).success; 
    }
    async _uploadUserData(courseId){
      const request = await fetch(`${COURSE_UPLOAD_TO_REMOTE_SERVER_ENDPOINT}${courseId}`);
      const resultString = await request.text();
      return JSON.parse(resultString).success;
    }
    async _uploadAllCoursesUsersData(){
      console.log("Here we are...");
      for (const course of Object.values(this._courses)) {
        if(course.id == 1) continue;
        course.downloading = true;
        this._courses[course.id] = course;
        this.requestUpdate();
        const res = await this._uploadUserData(course.id);
        course.downloading = false;
        course.downloadComplete = true;
        this._courses[course.id] = course;
        this.requestUpdate();
 
      }
    }     
}

customElements.define("main-section", App);
customElements.define("f-loading", LoadingElt);

