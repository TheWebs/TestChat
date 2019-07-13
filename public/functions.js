function setNick() {
  Swal.fire({
    title: 'Please type your nickname',
    input: 'text',
    inputAttributes: {
      autocapitalize: 'off'
    },
    showCancelButton: false,
    confirmButtonText: 'Enter chat',
    allowOutsideClick: false,
    allowEscapeKey: false
  }).then((result) => {
    $.ajax({
      type: "POST",
      url: "/users/nick",
      data: {nick: result.value},
      success: nickSuccess,
      dataType: "json"
    });
  });
}

function nickSuccess(data) {
  if(data.status == "ok")
  {
      window.location.href = "/chat";
  }
  else if (data.status == "already_has_nick") {
    Swal.fire({
  type: 'error',
  title: 'Oops...',
  text: 'Esse nick já está em uso, por favor escolha outro.',
}).then((result) => {
      setNick();
    });
  }
  else if (data.status == "invalid_nick") {
    Swal.fire(
      'Erro',
      'Inseriste um nick inválido!',
      'error'
    ).then((result) => {
      setNick();
    });
  }
}
