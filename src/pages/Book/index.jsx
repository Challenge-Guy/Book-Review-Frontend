import { useState, useCallback, useEffect } from "react";
import { FaUpload } from "react-icons/fa";
import instance from '../../utils/axios'
import { deleteData } from "../../utils/axios";

function BookRecommend() {
  const [value, setValue] = useState('');
  const [file, setFile] = useState(null);
  const [rows, setRows] = useState(1);
  const [loading, setLoading] = useState(false); 
  const [fileLoading, setFileLoading] = useState(false)
  const [books, setBooks] = useState([])

  const handleChange = useCallback((e) => {
    setValue(e.target.value);
    if (value.trim() === '') {
      setRows(1); 
    } else {
      const lineCount = Math.max(1, value.split('\n').length); 
      setRows(lineCount);
    }
  }, [value]);

  const handleFilechange = useCallback((e) => {
    console.log('file-=============', e.target.files[0]);

    setFile(e.target.files[0]);
  }, [file])

  const uploadFile = useCallback(async (e) => {
    e.preventDefault();
    const upData = new FormData(); 
    upData.append('file', file)  
    try {
      setFileLoading(true)
      const response = await instance.post('/book/upload', upData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response);
      setFileLoading(!fileLoading)
    } catch (error) {
      console.error(error);
      setFileLoading(false)
    }
  }, [file])

  const handleData = useCallback(async () => {
    const res = await deleteData('/book/deleteData');
    alert('Vector Storeからデータが削除されました。')  
  }, [value])

  const getBookData = useCallback(async (e) => {
    e.preventDefault();
    console.log('getbookdata', value);
    try {
      setLoading(true)
      const getData = {
        searchData: value
      }
      const res = await instance.post('/book/recommendBook', getData);  
      setLoading(false);  
      setBooks(res.data.text)  
    } catch (error) {
      console.log('cant get book data!')
      setLoading(false)
    }
  }, [value])
  useEffect(() => {
    console.log('efect books', books);

  }, [books])
  return (
    <div className="px-16 py-10">
      <h1>RAG テスト!!</h1>
      <form
        className="mt-10 flex items-center"
        onSubmit={uploadFile}
      >
        <div className="lg:tooltip" data-tip="アップロードデータはこちら。">
          <label className="btn btn-primary">
            <FaUpload style={{ color: 'white' }} />
            <input
              type="file"
              className="hidden"
              id="file_input"
              accept=".xlsx, .xls"
              onChange={handleFilechange}
            />
          </label>
        </div>
        <div className="lg:tooltip" data-tip="Pineconeにアップロード">
          <button className="btn btn-outline btn-primary ml-3" type="submit">アップロード</button>
        </div>
        <div className="lg:tooltip" data-tip="Pineone データの削除">
          <button className="btn btn-outline btn-error ml-3" type="reset" onClick={handleData}>削除</button>
        </div>
      </form>
      <div className="min-h-[60vh] mt-5 w-full p-5 flex justify-center">
        {loading ? (
          <div>
            読み込み中。。。
          </div>
        ) : (
          <>
            {
              books.length === 0 ? (
                <div className="w-[50%]">
                  <p className="text-center">データはありません。</p>
                </div>
              ) : (
                <div className="w-[50%]">
                  {books.map((book, index) =>
                    <div key={index} className="flex gap-3">
                      <h3 className="font-bold text-[24px]">{index + 1}.</h3>
                      <div className="w-full mt-2">
                        <div className="flex w-full">
                          <p className="w-[90px]">タイトル:</p>
                          <p>{book.title}</p>
                        </div>
                        <div className="flex mt-2 w-full">
                          <p className="w-[90px]">著者:</p>
                          <p>{book.author}</p>
                        </div>
                        <div className="flex mt-2 w-full">
                          <p className="w-[90px]">理由:</p>
                          <p className="w-[80%]">{book.reason}</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )
            }
          </>
        )}

      </div>
      <div className="flex justify-center">
        <form
          className="flex justify-center items-center gap-5 border border-indigo-600 rounded-[2rem] py-2 px-10 w-1/2"
          onSubmit={getBookData}
        >
          <textarea
            className="textarea w-full"
            rows={value ? rows : 1}
            placeholder="キーワード。。"
            value={value}
            onChange={handleChange}
          ></textarea>
          <button className="btn btn-primary">送信</button>
        </form>
      </div>
    </div>
  )
}

export default BookRecommend;
