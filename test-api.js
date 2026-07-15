async function test() {
  const formData = new FormData();
  const blob = new Blob(["dummy content"], { type: "application/pdf" });
  formData.append('file', blob, 'test.pdf');
  
  const res = await fetch('http://localhost:3000/api/extract-resume', {
    method: 'POST',
    body: formData
  });
  
  const text = await res.text();
  console.log("STATUS:", res.status);
  console.log("RESPONSE:", text.substring(0, 1000));
}
test();
