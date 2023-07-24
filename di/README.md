# DI small project

```mermaid
classDiagram
    namespace ComputerModule {
        class ComputerController {
            +run()
        }    
    }

    namespace CPUModule {
        class CPUService {
            +compute()
        }    
    }

    namespace DiskModule {
        class DiskService {
            +getData()
        }    
    }

    namespace PowerModule {
        class PowerService {
            +supplyPower()
        }    
    }

    ComputerController--> CPUService
    ComputerController--> DiskService
    CPUService--> PowerService
    DiskService--> PowerService
```
## cli 명령어 입력
```
nest g module computer
nest g controller computer

nest g module cpu
nest g service cpu

nest g module disk
nest g service disk

nest g module power
nest g service power
```