<?php
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

require 'phpmailer/Exception.php';
require 'phpmailer/PHPMailer.php';
require 'phpmailer/SMTP.php';

$sName = $_POST['name'];
$sPhone = $_POST['phone'];
$sEmail = $_POST['email'];

$mail = new PHPMailer(true);

try {
	$mail->CharSet = 'utf-8';

	// $mail->SMTPDebug = 3;                               // Enable verbose debug output

	$mail->isSMTP();                                      // Set mailer to use SMTP
	$mail->Host = 'smtp.domain.tld';  // Specify main and backup SMTP servers
	$mail->SMTPAuth = true;                               // Enable SMTP authentication
	$mail->Username = 'user';                 // Наш логин
	$mail->Password = 'password';                           // Наш пароль от ящика
	$mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;                            // Enable TLS encryption, `ssl` also accepted
	$mail->Port = 465;                                    // TCP port to connect to
	$mail->setLanguage('ru', 'phpmailer/language/');
	
	$mail->setFrom('no-reply@domain.tld', 'RunSmart');   // От кого письмо 
	$mail->addAddress('user@domain.tld');     // Add a recipient
	//$mail->addAddress('ellen@example.com');               // Name is optional
	//$mail->addReplyTo('info@example.com', 'Information');
	//$mail->addCC('cc@example.com');
	//$mail->addBCC('bcc@example.com');
	//$mail->addAttachment('/var/tmp/file.tar.gz');         // Add attachments
	//$mail->addAttachment('/tmp/image.jpg', 'new.jpg');    // Optional name
	$mail->isHTML(true);                                  // Set email format to HTML

	$mail->Subject = 'Данные';
	$mail->Body    = '
			Пользователь оставил данные <br> 
		Имя: ' . $sName . ' <br>
		Номер телефона: ' . $sPhone . '<br>
		E-mail: ' . $sEmail . '';
	$mail->AltBody = "
		Пользователь оставил данные
		Имя: ".$sName."
		Номер телефона: ".$sPhone."
		E-mail: ".$sEmail."";

	$mail->send();
	echo "Сообщение отправлено";
}
catch (Exception $e) {
    echo "Сообщение не может быть отправлено. Ошибка почтового клиента: {$mail->ErrorInfo}";
}
?>