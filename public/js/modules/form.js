

titleInput.addEventListener('input', function() {
  if (titleInput.value.trim() === '') {
    titleInput.setCustomValidity('Please enter a title');
  } else {
    titleInput.setCustomValidity('');
  }
});
