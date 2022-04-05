/* DML - Data Manipultaion Language*/
-- INSERT - Inserir
	INSERT INTO StatusTask(statusTask) 
    VALUES('Concluída');

    INSERT INTO StatusProjeto(statusProjeto)
    VALUES('Em andamento');

    INSERT INTO Tag(tituloTag)
    VALUES('Programação');

    INSERT INTO StatusUsuario(statusUsuario)
    VALUES('Disponível');

    INSERT INTO TipoUsuario(tituloTipoUsuario)
    VALUES('Gestor');

    INSERT INTO Usuario(idTipoUsuario, idStatus, nomeUsuario, sobreNome, cargaHoraria, horasTrabalhadas, email, senha, fotoUsuario)
    VALUES (1,1, 'Marcelo Makoto', 'Iagi dos Santos', 3, 3, 'marcelo.makoto@gmail.com', 'makoto123', 'teste.png');

    INSERT INTO Equipe(idUsuario, nomeEquipe, horasTrabalhadas)
    VALUES (1, 'Equipe LabWatch', 3);

    INSERT INTO Projeto(idEquipe, idStatusProjeto, tituloProjeto, dataInicio, dataConclusao)
    VALUES (1, 1, 'Projeto LabWatch','2022-03-24 15:00:00', '2022-03-25 15:00:00');

    INSERT INTO Task( idProjeto, idTag, idStatusTask, idUsuario, tituloTask, descricao, tempoTrabalho)
    VALUES (1, 1, 1, 1, 'Fazer gráficos usando JS', 'Gráficos que foram feitos com base na hora trabalhada da equipe', 1.5);

    INSERT INTO Comentario( idTask, idUsuario, comentario)
    VALUES ( 1, 1, 'Não esquecer de arrumar o bug na página antes de começar essa task');


    SELECT * FROM StatusTask;
    SELECT * FROM Tag;
    SELECT * FROM StatusUsuario;
    SELECT * FROM TipoUsuario;
    SELECT * FROM StatusProjeto;
