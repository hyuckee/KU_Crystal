0. KU_Crystal의 위치는 바탕화면으로 한다. **하위 폴더를 이동하지 않는다.**
   바탕화면>KU_Crystal>database~순으로 들어갈 수 있도록 한다.

1. 학사정보시스템에서 해당년도 해당학기 전체 <종합강의시간표내역.xlsx>를 다운받는다.
     이때 파일명이 위와 동일해야 하고, 저장위치는 KU_Crystal>database로 한다.

2. data_processing.exe파일을 실행한다.
     기다리면 콘솔창이 사라지고 database 폴더에 전처리된 LectureTable.csv가 생긴다.

3. main.html을 켜서 가장 아래의 [파일 업로드하기]를 눌러 전처리된 LectureTable.csv를 입력한다.

4. 파일이 제대로 입력되었다면 위의 4가지 창이 정상 작동된다.
   한 번 입력해놓으면 웬만해선 다시 업로드할 필요 없다.

5. 만약 정상 작동하지 않는다면 파일을 다시 업로드해본다.

6. 필요할 수도 있으니 data_processing.py를 Mac버전, Win버전으로 남겨놨다.

(Mac버전으로 실행파일을 만들었었지만, 받아서 열었을 때 확인되지 않은 개발자 어쩌구로 열리지 않았다..)
   