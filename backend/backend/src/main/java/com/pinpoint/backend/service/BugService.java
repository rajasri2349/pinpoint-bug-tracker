package com.pinpoint.backend.service;

import com.pinpoint.backend.model.Bug;
import com.pinpoint.backend.repository.BugRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BugService {

    @Autowired
    private BugRepository bugRepository;

    public List<Bug> getAllBugs() {
        return bugRepository.findAll();
    }

    public Optional<Bug> getBugById(Long id) {
        return bugRepository.findById(id);
    }

    public Bug createBug(Bug bug) {
        return bugRepository.save(bug);
    }

    public Bug updateBugStatus(Long id, String status) {
        Bug bug = bugRepository.findById(id).get();
        bug.setStatus(status);
        return bugRepository.save(bug);
    }

    public void deleteBug(Long id) {
        bugRepository.deleteById(id);
    }

    public List<Bug> getBugsByStatus(String status) {
        return bugRepository.findByStatus(status);
    }
}