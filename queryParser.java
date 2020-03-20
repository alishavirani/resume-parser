JSONObject obj=new JSONObject();
List<Object> listObj=new ArrayList<Object>();
    final ,. END_OF_SENTENCE = Pattern.compile("\\.\\s+");
        StringBuffer file_content = new StringBuffer("");

        //Form file content
        Blob blob = new javax.sql.rowset.serial.SerialBlob(candidateProfilesTbl.getCandidateProfile());
          /* byte[] pr = candidateProfilesTbl.getCandidateProfile();
            InputStream in=new ByteArrayInputStream(pr);*/
        if (candidateProfilesTbl.getOriginalFileName().substring(candidateProfilesTbl.getOriginalFileName().length() - 1).equals("x")) { //for docx
            try {
                XWPFDocument doc = new XWPFDocument(blob.getBinaryStream());
                XWPFWordExtractor extract = new XWPFWordExtractor(doc);
                file_content = new StringBuffer(extract.getText());
            } catch (Exception e) {
                log.error(e);

            }
        } else if (candidateProfilesTbl.getOriginalFileName().substring(candidateProfilesTbl.getOriginalFileName().length() - 1).equals("c")) { //for doc
            try {
                HWPFDocument document = new HWPFDocument(blob.getBinaryStream());
                WordExtractor extractor = new WordExtractor(document);
                String[] fileData = extractor.getParagraphText();
                for (int i = 0; i < fileData.length; i++)
                {
                    if (fileData[i] != null)
                        file_content = file_content.append(fileData[i]);
                }
            } catch (Exception e) {
                log.error(e);
            }
        }
        else if(candidateProfilesTbl.getOriginalFileName().substring(candidateProfilesTbl.getOriginalFileName().length() - 1).equals("f")){ //for pdf
            try {
                PDDocument document = PDDocument.load(blob.getBinaryStream());
                PDFTextStripper pdfStripper = new PDFTextStripper();
                String text = pdfStripper.getText(document);
                file_content = file_content.append(text);
                document.close();
            }
            catch (Exception e){
                log.error(e);
            }
        }

        String resume= file_content.toString().replaceAll("^\\s+",""); //remove all spaces for all lines beginning with one or more space chars
        obj.put("Resume",resume);

        if (candidateProfilesTbl.getOriginalFileName().substring(candidateProfilesTbl.getOriginalFileName().length() - 1
        if (candidateProfilesTbl.getOriginalFileName().substring(candidateProfilesTbl.getOriginalFileName().length() - 1
    String email_id = ""; String mobileNo="";
    Matcher ma = Pattern.compile("[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+").matcher(file_content); //email pattern
    while (ma.find()) {
        email_id = ma.group();
    }
    obj.put("EmailId", email_id);
    obj.put("defaultResume", candidateProfilesTbl.getDefaultResume());
    obj.put("Resume Name",candidateProfilesTbl.getOriginalFileName());

    Pattern pattern = null;
    String tot = "\\d{10}"; // 9876543210
    String spcl = "\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}";
    if (tot.equals("\\d{10}")) {
        pattern = Pattern.compile(tot);
        Matcher matcher = pattern.matcher(file_content);
        if (matcher.find()) {
            mobileNo=matcher.group(0);
        }
    }
    if ((spcl.equals("\\d{3}[-\\.\\s]\\d{3}[-\\.\\s]\\d{4}"))) { //checks phone no on 111-111-111/111.111.111
        pattern = Pattern.compile(spcl);
        Matcher matcher = pattern.matcher(file_content);
        if (matcher.find()) {
            mobileNo=matcher.group(0);
        }
    }
    obj.put("mobileNo", mobileNo);

    String[] lineByLine = file_content.toString().split("[\\r\\n]+"); //splits on new line
    String fName = "";
    String lName = "";
    for (int i = 0; i < lineByLine.length; i++) {
        if (!lineByLine[i].trim().equals("") ) { //if line not empty
            String currentLine = lineByLine[i].replaceAll(" +", " "); //Replaces one or more spaces with single space
            String line= currentLine.replaceAll("^\\s+",""); //removes one or more spaces in the beginning
            String[] lineSplit = line.split(" ");
            if (lineSplit.length > 1 && lineSplit.length <= 3) { //considers as name, forms firstname and lastname
                fName = lineSplit[0];
                lName = lineSplit[1];
                if (lineSplit.length == 3) {
                    lName = lineSplit[1] + " " + lineSplit[2];
                }
                break;
            }
        }
    }
    obj.put("FirstName", fName.trim());
    obj.put("LastName", lName.trim());

    String str=""; String TotExp="0";
    for (String sentence : END_OF_SENTENCE.split(file_content.toString())) {
        if (sentence.toLowerCase().contains("years") || sentence.toLowerCase().contains("year")) {
            str=sentence;
            break;
        }
    }
    Pattern p = Pattern.compile("-?\\d+(,\\d+)*?\\.?\\d+?"); //extract numbers from string for years of experience
    Matcher m = p.matcher(str);
    while (m.find()) {
        TotExp=m.group();
    }
    obj.put("Years Of Exp",TotExp);

    String st="null";
    Pattern LANGUAGES = Pattern.compile("\\.\\s+"); //matches . and any other white space char after . for skills
    for (String sentence : LANGUAGES.split(file_content.toString())) {
        if (sentence.toLowerCase().contains("languages") || (sentence.toLowerCase().contains("technical skills"))
                || (sentence.toLowerCase().contains("language")) || (sentence.toLowerCase().contains("Programming languages"))
        ) {
            st=sentence;
            break;
        }
    }
    obj.put("resume Skills",st);
        listObj.add(obj.toString());
