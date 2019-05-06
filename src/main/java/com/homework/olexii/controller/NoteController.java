package com.homework.olexii.controller;

import com.homework.olexii.entities.Notice;
import com.homework.olexii.repositories.NoteRepository;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = "/notes")
public class NoteController {

    @Autowired
    private NoteRepository noteRepository;

    @GetMapping
    public List<Notice> getNotes() {
        return noteRepository.findAll();
    }

    @GetMapping("{id}")
    public Notice getOne(@PathVariable("id") Notice notice) {
        return notice;
    }

    @PostMapping
    public Notice create(@RequestBody Notice notice) {
        noteRepository.save(notice);
        return notice;
    }

    @DeleteMapping("{id}")
    public List<Notice> delete(@PathVariable("id") Notice notice) {
        noteRepository.delete(notice);
        return noteRepository.findAll();
    }

    @PutMapping
    public Notice update(@RequestParam(value = "id") long id, @RequestBody Notice notice) {
        Notice noticeFromDB = noteRepository.getOne(id);
        BeanUtils.copyProperties(notice, noticeFromDB, "id");
        noteRepository.save(noticeFromDB);
        return notice;
    }
}
