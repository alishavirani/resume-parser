let paths = [
  '/home/alishavirani/resumes/Alisha Virani Resume.docx',
  '/home/alishavirani/resumes/Banking Resume For Freshers.docx',
  '/home/alishavirani/resumes/computer resume.docx',
  '/home/alishavirani/resumes/coolfreecv_resume_en_01.doc',
  '/home/alishavirani/resumes/Lakshmi_Profile.doc',
  '/home/alishavirani/resumes/SanjibExperienceResumePDF.pdf',
  '/home/alishavirani/resumes/TF16412141.docx',
  '/home/alishavirani/resumes/TF16412145.docx',
  '/home/alishavirani/resumes/TF16412149.docx', //gives invalid name
  '/home/alishavirani/Desktop/Virani Alisha Resume.pdf',
  '/home/alishavirani/resumes/Satya Narayana V.pdf',
  '/home/alishavirani/resumes/Shakeeba Sami.pdf',
  '/home/alishavirani/resumes/Soumya Ganesh Bhat.pdf',
  '/home/alishavirani/resumes/Yasser Patel.pdf'
]

let TikaParser = require('./TikaParser');
let ResumeParser = require('./ResumeParser');

let tika = new TikaParser();
let resume = new ResumeParser();

let parser = tika.parse(paths[13]);

parser.on('data', (data) => {
  // console.log("Full text for this document:");
  // console.log(data);

    resume.parse(data);
}); 

parser.on('error', (err) => {
    console.log("Error:");
    console.log(err.toString("utf8"));
});
  


