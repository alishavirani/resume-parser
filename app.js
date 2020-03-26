let paths = [
  '/home/alishavirani/resumes/Alisha Virani Resume.docx', //calculates name, email, mobile, experience
  '/home/alishavirani/resumes/Banking Resume For Freshers.docx', //cal name, email, phone, incorrect experience
  '/home/alishavirani/resumes/computer resume.docx',//cal name, email
  '/home/alishavirani/resumes/coolfreecv_resume_en_01.doc',//cal name, email, exp, incorrect phone
  '/home/alishavirani/resumes/Lakshmi_Profile.doc',//cal name,email,mobile,exp
  '/home/alishavirani/resumes/SanjibExperienceResumePDF.pdf',//cal name,email,mobile,exp
  '/home/alishavirani/resumes/TF16412145.docx', //cal name, email, mobile, exp
  '/home/alishavirani/resumes/TF16412149.docx', //gives incorrect name, correct email,phone,exp
  '/home/alishavirani/Desktop/Virani Alisha Resume.pdf',//cal name, email, mobile, incorrect exp bcoz of 7.44/10
  '/home/alishavirani/resumes/Satya Narayana V.pdf', //cal name, email, mobile, exp
  '/home/alishavirani/resumes/Shakeeba Sami.pdf',//cal name, email, mobile, exp
  '/home/alishavirani/resumes/Soumya Ganesh Bhat.pdf',//cal name, email, mobile, incorrect exp
  '/home/alishavirani/resumes/Yasser Patel.pdf',//cal name, email, mobile, exp
  '/home/alishavirani/resumes/Sujeet Yadav_CV.doc',//cal name, email, mobile, exp
  '/home/alishavirani/resumes/Surendra Kumar_CV.doc',//cal name, email, mobile, adds 2 work exp(incorrect)
  '/home/alishavirani/resumes/Mohd Tabish_CV.doc',//cal name, email, mobile, exp
  '/home/alishavirani/resumes/rama.doc'//cal name, email, mobile, sums up all work exp
]

let TikaParser = require('./TikaParser');
let ResumeParser = require('./ResumeParser');

let tika = new TikaParser();
let resume = new ResumeParser();

let parser = tika.parse(paths[16]);

parser.on('data', (data) => {
  // console.log("Full text for this document:");
  // console.log(data);

    resume.parse(data);
}); 

parser.on('error', (err) => {
    console.log("Error:");
    console.log(err.toString("utf8"));
});
  


